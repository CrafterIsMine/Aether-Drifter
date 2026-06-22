import { normalizeVector, randomFloat } from '../core/math.js';
export class Fiend{
constructor(startX, startY, strain){
this.locX = startX;
this.locY = startY;
this.velX = 0;
this.velY = 0;
this.strain = strain;
this.angle = 0;
this.isExpired = false;
this.flashTimer = 0;

if(strain === 0){
this.basePace = 120;
this.boundRad = 18;
this.anima = 30;
this.maxAnima = 30;
this.damage = 10;
this.aetherValue = 10;
this.color = '#ff3333';
}
else if(strain === 1){
this.basePace = 80;
this.boundRad = 30;
this.anima = 80;
this.maxAnima = 80;
this.damage = 25;
this.aetherValue = 25;
this.color = '#ff8800';
}
else{
this.basePace = 200;
this.boundRad = 12;
this.anima = 15;
this.maxAnima = 15;
this.damage = 5;
this.aetherValue = 5;
this.color = '#ffff00';
}
this.pace = this.basePace;
this.wobbleOffset = randomFloat(0, Math.PI * 2);
 } 
update(dt, targetX, targetY){
const dir = normalizeVector(targetX - this.locX, targetY - this.locY);
const wobble = Math.sin(performance.now() * 0.003 + this.wobbleOffset) * 0.5;
this.velX = dir.vecX * this.pace + dir.vecY * wobble * 50;
this.velY = dir.vecY * this.pace - dir.vecX * wobble * 50;
this.locX += this.velX * dt;
this.locY += this.velY * dt;
this.angle = Math.atan2(targetY - this.locY, targetX - this.locX);

if(this.flashTimer > 0)
this.flashTimer -= dt;
if(this.anima <= 0)
this.isExpired = true;
}
takeDamage(amount){
this.anima -= amount;
this.flashTimer = 0.1;
}

render(glyph){
glyph.save();
glyph.translate(this.locX, this.locY);
glyph.rotate(this.angle);
glyph.shadowColor = this.color;
glyph.shadowBlur = this.flashTimer > 0 ? 25 : 10;
const currentColor = this.flashTimer > 0 ? '#ffffff' : this.color;
glyph.beginPath();

if(this.strain === 0){
glyph.moveTo(this.boundRad, 0);
glyph.lineTo(-this.boundRad * 0.7, -this.boundRad * 0.7);
glyph.lineTo(-this.boundRad * 0.4, 0);
glyph.lineTo(-this.boundRad * 0.7, this.boundRad * 0.7);
}
else if(this.strain === 1){
for(let i = 0; i < 4; i++){
const ang = (Math.PI * 2 / 4) * i + Math.PI / 4;
const px = Math.cos(ang) * this.boundRad;
const py = Math.sin(ang) * this.boundRad;
if(i === 0)
glyph.moveTo(px, py);
else
glyph.lineTo(px, py);
 }
} 
else{
glyph.arc(0, 0, this.boundRad, 0, Math.PI * 2);
}
glyph.closePath();

glyph.fillStyle = currentColor;
glyph.fill();
glyph.strokeStyle = '#ffffff';
glyph.lineWidth = 2;
glyph.stroke();
glyph.restore();

if(this.anima < this.maxAnima){
const barWidth = this.boundRad * 2;
const barHeight = 4;
const barX = this.locX - barWidth / 2;
const barY = this.locY - this.boundRad - 10;
glyph.fillStyle = '#330000';
glyph.fillRect(barX, barY, barWidth, barHeight);
glyph.fillStyle = '#ff0000';
glyph.fillRect(barX, barY, barWidth * (this.anima / this.maxAnima), barHeight);
 }
   }
}