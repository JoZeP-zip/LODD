const API_BASE = "https://improved-lamp-pj9v5g46vvx73644w-8000.app.github.dev";

// ==================== INSERTAR ====================
async function insertarContrato(e) {
    e.preventDefault();
    const mensaje = document.getElementById("mensaje");

    const data = {
        empresa: document.getElementById("empresa").value,
        nombre: document.getElementById("nombre").value,
        fecha_ini: document.getElementById("fecha_ini").value,
        fecha_fin: document.getElementById("fecha_fin").value,
        fecha_cierre_maximo: document.getElementById("fecha_cierre_maximo").value,
        numero: document.getElementById("numero").value,
        correo: document.getElementById("correo").value,
        estado: document.getElementById("estado").value
    };

    try {
        const res = await fetch(`${API_BASE}/contratos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Error al guardar");

        mensaje.style.background = "#22c55e";
        mensaje.style.color = "#052e16";
        mensaje.textContent = "✅ Contrato guardado correctamente";
        mensaje.style.display = "block";

        document.getElementById("contratoForm").reset();
        cargarContratos();
    } catch (err) {
        mensaje.style.background = "#ef4444";
        mensaje.style.color = "white";
        mensaje.textContent = "❌ " + err.message;
        mensaje.style.display = "block";
    }
    setTimeout(() => mensaje.style.display = "none", 5000);
}

// ==================== CARGAR TABLA ====================
async function cargarContratos() {
    const tbody = document.querySelector("#tablaContratos tbody");
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:40px;">Cargando...</td></tr>`;

    try {
        const res = await fetch(`${API_BASE}/contratos`);
        const contratos = await res.json();

        let html = "";
        contratos.forEach(c => {
            const estadoClass = c.estado === "activo" ? "success" : 
                              (c.estado === "pendiente" ? "pending" : "closed");

            html += `
                <tr>
                    <td><strong>${c.id}</strong></td>
                    <td>${c.empresa}</td>
                    <td>${c.nombre}</td>
                    <td>${c.fecha_ini}</td>
                    <td>${c.fecha_fin}</td>
                    <td>${c.fecha_cierre_maximo}</td>
                    <td>${c.numero}</td>
                    <td>${c.correo}</td>
                    <td><span class="status ${estadoClass}">${c.estado}</span></td>
                    <td class="actions">
                        <button onclick="abrirModalEditar(${c.id})" class="btn-edit">✏️ Editar</button>
                        <button onclick="eliminarContrato(${c.id})" class="btn-delete">🗑️ Eliminar</button>
                    </td>
                </tr>`;
        });

        tbody.innerHTML = html || `<tr><td colspan="10" style="text-align:center;padding:40px;color:#64748b;">No hay contratos</td></tr>`;
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:40px;color:#ef4444;">Error al cargar</td></tr>`;
    }
}

// ==================== EDITAR ====================
let contratoEditandoId = null;

async function abrirModalEditar(id) {
    contratoEditandoId = id;
    const modal = document.getElementById("editModal");

    try {
        const res = await fetch(`${API_BASE}/contratos`);
        const contratos = await res.json();
        const contrato = contratos.find(c => c.id === id);

        if (!contrato) return alert("Contrato no encontrado");

        document.getElementById("edit_empresa").value = contrato.empresa;
        document.getElementById("edit_nombre").value = contrato.nombre;
        document.getElementById("edit_fecha_ini").value = contrato.fecha_ini;
        document.getElementById("edit_fecha_fin").value = contrato.fecha_fin;
        document.getElementById("edit_fecha_cierre_maximo").value = contrato.fecha_cierre_maximo;
        document.getElementById("edit_numero").value = contrato.numero;
        document.getElementById("edit_correo").value = contrato.correo;
        document.getElementById("edit_estado").value = contrato.estado;

        modal.style.display = "flex";
    } catch (err) {
        alert("Error al abrir edición: " + err.message);
    }
}

async function guardarEdicion(e) {
    e.preventDefault();
    const mensaje = document.getElementById("mensaje");

    const data = {
        empresa: document.getElementById("edit_empresa").value,
        nombre: document.getElementById("edit_nombre").value,
        fecha_ini: document.getElementById("edit_fecha_ini").value,
        fecha_fin: document.getElementById("edit_fecha_fin").value,
        fecha_cierre_maximo: document.getElementById("edit_fecha_cierre_maximo").value,
        numero: document.getElementById("edit_numero").value,
        correo: document.getElementById("edit_correo").value,
        estado: document.getElementById("edit_estado").value
    };

    try {
        const res = await fetch(`${API_BASE}/contratos/${contratoEditandoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Error al actualizar");

        mensaje.style.background = "#22c55e";
        mensaje.style.color = "#052e16";
        mensaje.textContent = "✅ Contrato actualizado correctamente";
        mensaje.style.display = "block";

        cerrarModal();
        cargarContratos();
    } catch (err) {
        mensaje.style.background = "#ef4444";
        mensaje.style.color = "white";
        mensaje.textContent = "❌ " + err.message;
        mensaje.style.display = "block";
    }
    setTimeout(() => mensaje.style.display = "none", 5000);
}

function cerrarModal() {
    document.getElementById("editModal").style.display = "none";
    contratoEditandoId = null;
}

// ==================== ELIMINAR ====================
async function eliminarContrato(id) {
    if (!confirm(`¿Eliminar el contrato ID ${id}?`)) return;

    const mensaje = document.getElementById("mensaje");

    try {
        const res = await fetch(`${API_BASE}/contratos/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");

        mensaje.style.background = "#22c55e";
        mensaje.style.color = "#052e16";
        mensaje.textContent = `✅ Contrato ${id} eliminado`;
        mensaje.style.display = "block";

        cargarContratos();
    } catch (err) {
        mensaje.style.background = "#ef4444";
        mensaje.style.color = "white";
        mensaje.textContent = "❌ " + err.message;
        mensaje.style.display = "block";
    }
    setTimeout(() => mensaje.style.display = "none", 5000);
}

// ==================== INICIO ====================
window.onload = () => {
    cargarContratos();

    const editForm = document.getElementById("editForm");
    if (editForm) editForm.addEventListener("submit", guardarEdicion);
};