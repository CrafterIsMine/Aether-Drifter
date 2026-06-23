import {randomFloat} from '../core/math.js';
class Star{
constructor(canvasW, canvasH){
this.locX = randomFloat(-canvasW, canvasW * 2);
this.locY = randomFloat(-canvasH, canvasH * 2);
this.depth = randomFloat(0.1, 1.0);
this.boundRad = this.depth * 2;
this.baseAlpha = this.depth * 0.8;
}
}
class Debris{
constructor(){
this.locX = randomFloat(-2000, 2000);
this.locY = randomFloat(-2000, 2000);
this.angle = randomFloat(0, Math.PI * 2);
this.rotSpeed = randomFloat(-1, 1);
this.boundRad = randomFloat(10, 40);
this.vertices = [];
const points = Math.floor(randomFloat(4, 8));
for(let i = 0; i < points; i++){
const ang = (Math.PI * 2 / points) * i;
const dist = this.boundRad * randomFloat(0.5, 1.0);
this.vertices.push({ locX: Math.cos(ang) * dist, locY: Math.sin(ang) * dist });
  }
 }
}
export class EnvironmentSystem{
constructor(){
this.stars = [];
this.debris = [];
this.initStars();
this.initDebris();
}

initStars(){
for(let i = 0; i < 200; i++){
this.stars.push(new Star(window.innerWidth, window.innerHeight));
 }
}

initDebris(){
for(let i = 0; i < 30; i++){
this.debris.push(new Debris());
 }
}
update(dt){
for(const d of this.debris){
d.angle += d.rotSpeed * dt;
 }
}

render(glyph, camX, camY, canvasW, canvasH){
for(const star of this.stars){
const parallaxX = star.locX - camX * star.depth;
const parallaxY = star.locY - camY * star.depth;
const screenX = ((parallaxX % canvasW) + canvasW) % canvasW;
const screenY = ((parallaxY % canvasH) + canvasH) % canvasH;
glyph.beginPath();
glyph.arc(screenX, screenY, star.boundRad, 0, Math.PI * 2);
glyph.fillStyle = `rgba(255, 255, 255, ${star.baseAlpha})`;
glyph.fill();
}
for(const d of this.debris){
const screenX = d.locX - camX * 0.5 + canvasW / 2;
const screenY = d.locY - camY * 0.5 + canvasH / 2;
if(screenX < -100 || screenX > canvasW + 100 || screenY < -100 || screenY > canvasH + 100)
continue;
glyph.save();
glyph.translate(screenX, screenY);
glyph.rotate(d.angle);
glyph.beginPath();
for(let i = 0; i < d.vertices.length; i++){
const v = d.vertices[i];
if(i === 0)
glyph.moveTo(v.locX, v.locY);
else
glyph.lineTo(v.locX, v.locY);
}
glyph.closePath();
glyph.fillStyle = 'rgba(30, 30, 40, 0.6)';
glyph.fill();
glyph.strokeStyle = 'rgba(60, 60, 80, 0.4)';
glyph.lineWidth = 1;
glyph.stroke();
glyph.restore();
 }
 }
}