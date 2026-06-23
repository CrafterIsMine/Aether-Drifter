import {randomFloat, randomInt} from '../core/math.js';
class Spark{
constructor(startX, startY, color){
this.locX = startX;
this.locY = startY;
const angle = randomFloat(0, Math.PI * 2);
const speed = randomFloat(50, 250);
this.velX = Math.cos(angle) * speed;
this.velY = Math.sin(angle) * speed;
this.lifespan = randomFloat(0.3, 0.8);
this.maxLife = this.lifespan;
this.boundRad = randomFloat(2, 5);
this.color = color;
this.isExpired = false;
 }
update(dt){
this.locX += this.velX * dt;
this.locY += this.velY * dt;
this.velX *= 0.95;
this.velY *= 0.95;
this.lifespan -= dt;
if(this.lifespan <= 0)
this.isExpired = true;
}
render(glyph){
const alpha = this.lifespan / this.maxLife;
const currentRad = this.boundRad * alpha;
glyph.beginPath();
glyph.arc(this.locX, this.locY, currentRad, 0, Math.PI * 2);
glyph.fillStyle = this.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
glyph.fill();
 }
}
export class ParticleSystem{
constructor(){
this.sparks = [];
}
emitBurst(posX, posY, color, count){
for(let i = 0; i < count; i++){
this.sparks.push(new Spark(posX, posY, color));
 }
}

emitTrail(posX, posY, color){
if(Math.random() > 0.3)
return;
this.sparks.push(new Spark(posX, posY, color));
}

update(dt){
for(let i = this.sparks.length - 1; i >= 0; i--){
this.sparks[i].update(dt);
if(this.sparks[i].isExpired){
this.sparks.splice(i, 1);
 }
  }
}

render(glyph){
for(const spark of this.sparks){
spark.render(glyph);
  }
 }
}