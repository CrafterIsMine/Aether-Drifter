import { checkCircleOverlap } from '../core/math.js';
import { optic } from '../core/camera.js';
export class CombatSystem{
constructor(){
this.bolts = [];
this.fiends = [];
}

registerBolt(bolt){
this.bolts.push(bolt);
}

registerFiend(fiend){
this.fiends.push(fiend);
}

update(dt, vessel, particleSys){
for(let i = this.bolts.length - 1; i >= 0; i--){
const bolt = this.bolts[i];
bolt.update(dt);
if(bolt.isExpired){
this.bolts.splice(i, 1);
continue;
}

for(let j = this.fiends.length - 1; j >= 0; j--){
const fiend = this.fiends[j];
if(checkCircleOverlap(bolt, fiend)){
fiend.takeDamage(bolt.damage);
particleSys.emitBurst(bolt.locX, bolt.locY, fiend.color, 8);
bolt.isExpired = true;
this.bolts.splice(i, 1);
optic.induceShake(3);

if(fiend.isExpired){
particleSys.emitBurst(fiend.locX, fiend.locY, fiend.color, 25);
vessel.absorbAether(fiend.aetherValue);
this.fiends.splice(j, 1);
 }
break;
 }
}
}
for(let i = this.fiends.length - 1; i >= 0; i--){
const fiend = this.fiends[i];
fiend.update(dt, vessel.locX, vessel.locY);
if(checkCircleOverlap(fiend, vessel)){
vessel.takeDamage(fiend.damage * dt);
const pushAngle = Math.atan2(vessel.locY - fiend.locY, vessel.locX - fiend.locX);
vessel.locX += Math.cos(pushAngle) * 100 * dt;
vessel.locY += Math.sin(pushAngle) * 100 * dt;
}
}
}

render(glyph){
for(const bolt of this.bolts){
bolt.render(glyph);
}
for(const fiend of this.fiends){
fiend.render(glyph);
 }
}
}
