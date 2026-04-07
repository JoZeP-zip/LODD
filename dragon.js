const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("load", function () {
    const splash = document.getElementById("splash");
    setTimeout(() => {
      splash.classList.add("hidden");
    }, 2500);
  });

// estados
let dragonActive = false;

let egg = {
x: window.innerWidth - 60,
y: window.innerHeight - 60,
size: 25
};

let eggShakeTimer = 0;
let eggPieces = [];

let mouse = { x: canvas.width/2, y: canvas.height/2 };
let firing = false;
let fireParticles = [];

document.addEventListener("mousemove", e=>{
mouse.x = e.clientX;
mouse.y = e.clientY;
});

document.addEventListener("mousedown", ()=> firing = true);
document.addEventListener("mouseup", ()=> firing = false);

document.addEventListener("keydown", e=>{
if(e.key === "Escape"){
dragonActive = false;
}
});

// detectar clic en el huevo
document.addEventListener("click", e=>{

let dx = e.clientX - egg.x;
let dy = e.clientY - egg.y;
let dist = Math.sqrt(dx*dx + dy*dy);

if(!dragonActive && dist < egg.size){

crackEgg();

setTimeout(()=>{

dragonActive = true;

segments.forEach(s=>{
s.x = mouse.x;
s.y = mouse.y;
});

},300);

}

});

// segmento del cuerpo
class Segment{
constructor(x,y){
this.x=x;
this.y=y;
this.angle=0;
}

follow(tx,ty){

let dx = tx-this.x;
let dy = ty-this.y;

this.angle = Math.atan2(dy,dx);

this.x = tx - Math.cos(this.angle)*18;
this.y = ty - Math.sin(this.angle)*18;
}

draw(size){

ctx.save();
ctx.translate(this.x,this.y);
ctx.rotate(this.angle);

ctx.fillStyle="#8c3324";

ctx.beginPath();
ctx.ellipse(0,0,size,size*0.55,0,0,Math.PI*2);
ctx.fill();

ctx.restore();

}
}

// crear cuerpo
let segments=[];
for(let i=0;i<6;i++){
segments.push(new Segment(mouse.x,mouse.y));
}

// cabeza
function drawHead(x,y,angle){

ctx.save();
ctx.translate(x,y);
ctx.rotate(angle);

ctx.fillStyle="#8c3324";

ctx.beginPath();
ctx.moveTo(35,0);
ctx.lineTo(-25,-18);
ctx.lineTo(-10,0);
ctx.lineTo(-25,18);
ctx.closePath();
ctx.fill();

// cuernos
ctx.fillStyle="#af4328";

ctx.beginPath();
ctx.moveTo(-10,-18);
ctx.lineTo(-5,-30);
ctx.lineTo(0,-18);
ctx.fill();

ctx.beginPath();
ctx.moveTo(-10,18);
ctx.lineTo(-5,30);
ctx.lineTo(0,18);
ctx.fill();

// ojo achinado
ctx.fillStyle="white";
ctx.beginPath();
ctx.moveTo(12,-6);
ctx.quadraticCurveTo(18,-10,24,-6);
ctx.quadraticCurveTo(18,-2,12,-6);
ctx.fill();

// pupila reptil
ctx.fillStyle="black";
ctx.beginPath();
ctx.ellipse(18,-6,1.5,3,0,0,Math.PI*2);
ctx.fill();

ctx.restore();
}

// alas
function drawWings(x,y,angle){

ctx.save();
ctx.translate(x,y);
ctx.rotate(angle);

ctx.fillStyle="#af472899";

ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(-80,-45);
ctx.lineTo(-45,0);
ctx.closePath();
ctx.fill();

ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(-80,45);
ctx.lineTo(-45,0);
ctx.closePath();
ctx.fill();

ctx.restore();

}

// fuego
function spawnFire(){

let angle = segments[0].angle;

fireParticles.push({
x: mouse.x + Math.cos(angle)*10,
y: mouse.y + Math.sin(angle)*10,
vx: Math.cos(angle)*3 + (Math.random()-0.5)*2,
vy: Math.sin(angle)*2 + (Math.random()-0.5)*2,
life:50
});

}

function drawFire(){

if(firing){
for(let i=0;i<3;i++) spawnFire();
}

for(let i=0;i<fireParticles.length;i++){

let p = fireParticles[i];

ctx.fillStyle=`rgba(255,${120+Math.random()*100},0,${p.life/10})`;

ctx.beginPath();
ctx.arc(p.x,p.y,4,0,Math.PI*2);
ctx.fill();

p.x+=p.vx;
p.y+=p.vy;
p.life--;

if(p.life<=0){
fireParticles.splice(i,1);
i--;
}

}

}

// huevo
function drawEgg(){

let shakeX = 0;
let shakeY = 0;

eggShakeTimer++;

if(Math.sin(eggShakeTimer*0.05) > 0.95){

shakeX = (Math.random()-0.5)*4;
shakeY = (Math.random()-0.5)*4;

}

ctx.save();
ctx.translate(egg.x + shakeX, egg.y + shakeY);

ctx.fillStyle="#f5f5f5";
ctx.beginPath();
ctx.ellipse(0,0,18,26,0,0,Math.PI*2);
ctx.fill();

ctx.fillStyle="rgba(0,0,0,0.1)";
ctx.beginPath();
ctx.ellipse(0,8,12,8,0,0,Math.PI*2);
ctx.fill();

ctx.fillStyle="rgba(255,255,255,0.9)";
ctx.beginPath();
ctx.ellipse(-5,-8,4,6,0,0,Math.PI*2);
ctx.fill();

ctx.restore();

}

// romper huevo
function crackEgg(){

for(let i=0;i<12;i++){

eggPieces.push({
x: egg.x,
y: egg.y,
vx:(Math.random()-0.5)*6,
vy:(Math.random()-0.5)*6,
rot:Math.random()*Math.PI,
vr:(Math.random()-0.5)*0.3,
life:120
});

}

}

// dibujar pedazos
function drawEggPieces(){

for(let i=0;i<eggPieces.length;i++){

let p = eggPieces[i];

ctx.save();
ctx.translate(p.x,p.y);
ctx.rotate(p.rot);

ctx.fillStyle="#f5f5f5";

ctx.beginPath();
ctx.moveTo(-6,-4);
ctx.lineTo(6,-4);
ctx.lineTo(0,6);
ctx.closePath();
ctx.fill();

ctx.restore();

p.x += p.vx;
p.y += p.vy;
p.rot += p.vr;
p.life--;

if(p.life<=0){
eggPieces.splice(i,1);
i--;
}

}

}

// animación
function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

// modo huevo
if(!dragonActive){

drawEgg();
drawEggPieces();

requestAnimationFrame(animate);
return;

}

// movimiento del dragón
let noseOffset = 35;

let angle = Math.atan2(mouse.y - segments[0].y, mouse.x - segments[0].x);

let headX = mouse.x - Math.cos(angle)*noseOffset;
let headY = mouse.y - Math.sin(angle)*noseOffset;

let tx = headX;
let ty = headY;

segments.forEach((seg,i)=>{

seg.follow(tx,ty);

tx = seg.x;
ty = seg.y;

seg.draw(12-i*0.18);

});

drawWings(segments[5].x,segments[5].y,segments[5].angle);

drawHead(headX, headY, segments[0].angle);

drawFire();

// texto
ctx.fillStyle="white";
ctx.font="16px Arial";
ctx.textAlign="center";


ctx.fillText(
"Presiona ESC para que Drak regrese",
canvas.width/2,
canvas.height-30
);

requestAnimationFrame(animate);

}

animate();