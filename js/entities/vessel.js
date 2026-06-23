import {input} from '../core/input.js';
import {optic} from '../core/camera.js';
import {synth} from '../core/synth.js';
import {normalizeVector, clampValue, degToRad, lerpValues} from '../core/math.js';
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
this.dashCooldown = 0;
this.dashDuration = 0;
this.dashMaxDuration = 0.15;
this.dashBaseCooldown = 1.0;
this.isDashing = false;
this.dashVelX = 0;
this.dashVelY = 0;
this.shieldAngle = 0;
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
if(this.dashDuration > 0){
this.dashDuration -= dt;
this.locX += this.dashVelX * dt;
this.locY += this.dashVelY * dt;
this.invulnTimer = 0.1;
} 
else{
this.velX = normalized.vecX * this.pace;
this.velY = normalized.vecY * this.pace;
this.locX += this.velX * dt;
this.locY += this.velY * dt;
}
if(input.wasKeyPressed('ShiftLeft') && this.dashCooldown <= 0 && (moveX !== 0 || moveY !== 0)){
this.isDashing = true;
this.dashDuration = this.dashMaxDuration;
this.dashCooldown = this.dashBaseCooldown * this.mass;
const dashSpeed = 1200;
this.dashVelX = normalized.vecX * dashSpeed;
this.dashVelY = normalized.vecY * dashSpeed;
synth.triggerDash();
}

const worldMouse = optic.screenToWorld(input.mouseLocX, input.mouseLocY, window.innerWidth, window.innerHeight);
this.angle = Math.atan2(worldMouse.locY - this.locY, worldMouse.locX - this.locX);

if(this.fireCooldown > 0)
this.fireCooldown -= dt;
if(this.invulnTimer > 0)
this.invulnTimer -= dt;
if(this.purgeCooldown > 0)
this.purgeCooldown -= dt;
if(this.dashCooldown > 0)
this.dashCooldown -= dt;

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
this.shieldAngle += dt * 2;
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
if(this.dashDuration > 0){
glyph.globalAlpha = 0.5;
glyph.beginPath();
glyph.arc(0, 0, this.boundRad * 1.5, 0, Math.PI * 2);
glyph.fillStyle = 'rgba(0, 255, 255, 0.3)';
glyph.fill();
glyph.globalAlpha = 1.0;
}

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
else 
glyph.lineTo(px, py);
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
if(this.dashCooldown > 0){
const cdRatio = this.dashCooldown / (this.dashBaseCooldown * this.mass);
glyph.beginPath();
glyph.arc(this.locX, this.locY, this.boundRad + 8, -Math.PI / 2, -Math.PI / 2 + (1 - cdRatio) * Math.PI * 2);
glyph.strokeStyle = 'rgba(0, 255, 255, 0.5)';
glyph.lineWidth = 2;
glyph.stroke();
}
if(this.mass > 1.5){
glyph.save();
glyph.translate(this.locX, this.locY);
glyph.rotate(this.shieldAngle);
glyph.beginPath();
for(let i = 0; i < 3; i++){
const ang = (Math.PI * 2 / 3) * i;
const px = Math.cos(ang) * (this.boundRad + 15);
const py = Math.sin(ang) * (this.boundRad + 15);
glyph.moveTo(px, py);
glyph.arc(px, py, 3, 0, Math.PI * 2);
}
glyph.fillStyle = 'rgba(255, 0, 255, 0.6)';
glyph.fill();
glyph.restore();
 }
}
}
