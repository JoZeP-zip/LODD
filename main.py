# IMPORTANTEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
# USAR PARA INICIAR EL SIGUIENTE COMANDO EN LA TERMINAL: uvicorn main:app --reload --host 0.0.0.0 --port 8000
# LUEGO DE ESO ABRIR ESTA URL: https://improved-lamp-pj9v5g46vvx73644w-8000.app.github.dev/docs




from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("❌ No se encontraron las credenciales de Supabase en .env")

app = FastAPI(title="API Gestión de Contratos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://improved-lamp-pj9v5g46vvx73644w-5500.app.github.dev",  # ← Tu Live Server
        "https://improved-lamp-pj9v5g46vvx73644w-8000.app.github.dev",  # ← Tu backend
        "*"  # por si acaso
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],   # ← importante en Codespaces
)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class Contrato(BaseModel):
    empresa: str
    nombre: str
    fecha_ini: str
    fecha_fin: str
    fecha_cierre_maximo: str
    numero: str
    correo: str
    estado: str

# ====================== CRUD ======================

@app.get("/contratos")
async def obtener_contratos():
    try:
        response = supabase.table("contratos").select("*").order("id", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/contratos")
async def insertar_contrato(contrato: Contrato):
    try:
        data = contrato.model_dump()
        response = supabase.table("contratos").insert(data).execute()
        return response.data[0] if response.data else {"message": "Contrato creado"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/contratos/{contrato_id}")
async def actualizar_contrato(contrato_id: int, contrato: Contrato):
    try:
        # Verificar si existe
        exists = supabase.table("contratos").select("id").eq("id", contrato_id).execute()
        if not exists.data:
            raise HTTPException(status_code=404, detail="Contrato no encontrado")
        
        data = contrato.model_dump()
        response = supabase.table("contratos").update(data).eq("id", contrato_id).execute()
        
        return {"message": f"Contrato {contrato_id} actualizado correctamente", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/contratos/{contrato_id}")
async def eliminar_contrato(contrato_id: int):
    try:
        exists = supabase.table("contratos").select("id").eq("id", contrato_id).execute()
        if not exists.data:
            raise HTTPException(status_code=404, detail="Contrato no encontrado")
        
        supabase.table("contratos").delete().eq("id", contrato_id).execute()
        return {"message": f"Contrato {contrato_id} eliminado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)