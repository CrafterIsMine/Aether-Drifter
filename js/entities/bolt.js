export class Bolt{
constructor(startX, startY, angle, damage, massScale){
this.locX = startX;
this.locY = startY;
this.pace = 800;
this.velX = Math.cos(angle) * this.pace;
this.velY = Math.sin(angle) * this.pace;
this.boundRad = 4 * massScale;
this.damage = damage * massScale;
this.lifespan = 2.0;
this.isExpired = false;
this.trail = [];
}

update(dt){
this.locX += this.velX * dt;
this.locY += this.velY * dt;
this.lifespan -= dt;
this.trail.push({ locX: this.locX, locY: this.locY, life: 0.3 });
for(let i = this.trail.length - 1; i >= 0; i--){
this.trail[i].life -= dt;
if(this.trail[i].life <= 0){
this.trail.splice(i, 1);
 }
}
if(this.lifespan <= 0){
this.isExpired = true;
}
 }

render(glyph){
for(const point of this.trail){
const alpha = point.life / 0.3;
glyph.beginPath();
glyph.arc(point.locX, point.locY, this.boundRad * alpha, 0, Math.PI * 2);
glyph.fillStyle = `rgba(255, 100, 255, ${alpha * 0.5})`;
glyph.fill();
}

glyph.save();
glyph.shadowColor = '#ff00ff';
glyph.shadowBlur = 10;
glyph.beginPath();
glyph.arc(this.locX, this.locY, this.boundRad, 0, Math.PI * 2);
glyph.fillStyle = '#ffffff';
glyph.fill();
glyph.restore();
 }
}