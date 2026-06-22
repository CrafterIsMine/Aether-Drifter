import {input} from '../core/input.js';
import {optic} from '../core/camera.js';
import {normalizeVector, clampValue, degToRad} from '../core/math.js';
export class Vessel{
constructor(startX, startY){
this.locX = startX;
this.locY = startY;
this.velX = 0;
this.velY = 0;
this.basePace = 300;
this.pace = this.basePace;
this.baseRad = 15;
this.boundRad = this.baseRad;
this.anima = 100;
this.maxAnima = 100;
this.aether = 0;
this.mass = 1.0;
this.maxMass = 5.0;
this.angle = 0;
this.fireCooldown = 0;
this.fireRate = 0.2;
this.isPurging = false;
this.purgeCooldown = 0;
this.invulnTimer = 0;
this.trailTimer = 0;
}
update(dt){
let moveX = 0;
let moveY = 0;
if(input.isKeyHeld('KeyW') || input.isKeyHeld('ArrowUp'))
moveY -= 1;
if(input.isKeyHeld('KeyS') || input.isKeyHeld('ArrowDown'))
moveY += 1;
if(input.isKeyHeld('KeyA') || input.isKeyHeld('ArrowLeft'))
moveX -= 1;
if(input.isKeyHeld('KeyD') || input.isKeyHeld('ArrowRight'))
moveX += 1;
const normalized = normalizeVector(moveX, moveY);
this.pace = this.basePace / this.mass;
this.boundRad = this.baseRad * (1 + (this.mass - 1) * 0.4);
this.velX = normalized.vecX * this.pace;
this.velY = normalized.vecY * this.pace;
this.locX += this.velX * dt;
this.locY += this.velY * dt;
const worldMouse = optic.screenToWorld(input.mouseLocX, input.mouseLocY, window.innerWidth, window.innerHeight);
this.angle = Math.atan2(worldMouse.locY - this.locY, worldMouse.locX - this.locX);

if(this.fireCooldown > 0)
this.fireCooldown -= dt;
if(this.invulnTimer > 0) 
this.invulnTimer -= dt;
if(this.purgeCooldown > 0) 
this.purgeCooldown -= dt;

if(input.isKeyHeld('Space') && this.aether > 0 && this.purgeCooldown <= 0){
this.isPurging = true;
this.aether -= 20 * dt;
this.mass = clampValue(this.mass - 1.5 * dt, 1.0, this.maxMass);
if(this.aether <= 0){
this.aether = 0;
this.mass = 1.0;
this.purgeCooldown = 1.0;
 } 
}
else{
this.isPurging = false;
}
this.trailTimer -= dt;
}
absorbAether(amount){
this.aether += amount;
this.mass = clampValue(this.mass + amount * 0.05, 1.0, this.maxMass);
}
takeDamage(amount){
if(this.invulnTimer > 0)
return;
this.anima -= amount;
this.invulnTimer = 0.5;
optic.induceShake(10);
 }
render(glyph){
glyph.save();
glyph.translate(this.locX, this.locY);
glyph.rotate(this.angle);
const pulse = Math.sin(performance.now() * 0.005) * 0.2 + 1;
const currentRad = this.boundRad * pulse;
if(this.isPurging){
glyph.shadowColor = '#00ffff';
glyph.shadowBlur = 20;
}
else{
glyph.shadowColor = '#ff00ff';
glyph.shadowBlur = 15;
 }
glyph.beginPath();
for(let i = 0; i < 6; i++){
const ang = (Math.PI * 2 / 6) * i;
const px = Math.cos(ang) * currentRad;
const py = Math.sin(ang) * currentRad;
if(i === 0)
glyph.moveTo(px, py);
else glyph.lineTo(px, py);
}
glyph.closePath();
const grad = glyph.createRadialGradient(0, 0, 0, 0, 0, currentRad);
grad.addColorStop(0, this.isPurging ? '#aaffff' : '#ffaaff');
grad.addColorStop(1, this.isPurging ? '#008888' : '#880088');
glyph.fillStyle = grad;
glyph.fill();

glyph.strokeStyle = '#ffffff';
glyph.lineWidth = 2;
glyph.stroke();

glyph.beginPath();
glyph.moveTo(currentRad * 0.5, 0);
glyph.lineTo(currentRad * 1.5, 0);
glyph.strokeStyle = '#ffffff';
glyph.lineWidth = 3;
glyph.stroke();

glyph.restore();
 }
}
