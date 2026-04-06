const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: canvas.width/2, y: canvas.height/2 };
let firing = false;
let fireParticles = [];

document.addEventListener("mousemove", e=>{
mouse.x = e.clientX;
mouse.y = e.clientY;
});

document.addEventListener("mousedown", ()=> firing = true);
document.addEventListener("mouseup", ()=> firing = false);

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

ctx.fillStyle="#2ecc71";

ctx.beginPath();
ctx.ellipse(0,0,size,size*0.55,0,0,Math.PI*2);
ctx.fill();

ctx.restore();
}
}

let segments=[];
for(let i=0;i<7;i++){
segments.push(new Segment(mouse.x,mouse.y));
}

function drawHead(x,y,angle){

ctx.save();
ctx.translate(x,y);
ctx.rotate(angle);

ctx.fillStyle="#27ae60";

ctx.beginPath();
ctx.moveTo(35,0);
ctx.lineTo(-25,-18);
ctx.lineTo(-10,0);
ctx.lineTo(-25,18);
ctx.closePath();
ctx.fill();

ctx.fillStyle="#1e8449";

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

ctx.fillStyle="white";
ctx.beginPath();
ctx.arc(10,-6,4,0,Math.PI*2);
ctx.fill();

ctx.fillStyle="black";
ctx.beginPath();
ctx.arc(11,-6,2,0,Math.PI*2);
ctx.fill();

ctx.restore();
}

function drawWings(x,y,angle){

ctx.save();
ctx.translate(x,y);
ctx.rotate(angle);

ctx.fillStyle="rgba(39,174,96,0.6)";

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

function spawnFire(){

let angle = segments[0].angle;

fireParticles.push({
x: mouse.x + Math.cos(angle)*40,
y: mouse.y + Math.sin(angle)*40,
vx: Math.cos(angle)*1 + (Math.random()-0.5)*2,
vy: Math.sin(angle)*1 + (Math.random()-0.5)*2,
life:200
});
}

function drawFire(){

if(firing){
for(let i=0;i<3;i++) spawnFire();
}

for(let i=0;i<fireParticles.length;i++){

let p = fireParticles[i];

ctx.fillStyle=`rgba(255,${120+Math.random()*100},0,${p.life/40})`;

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

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

let tx=mouse.x;
let ty=mouse.y;

segments.forEach((seg,i)=>{

seg.follow(tx,ty);

tx=seg.x;
ty=seg.y;

seg.draw(12-i*0.18);

});

drawWings(segments[5].x,segments[5].y,segments[5].angle);

drawHead(mouse.x,mouse.y,segments[0].angle);

drawFire();

requestAnimationFrame(animate);

}

animate();