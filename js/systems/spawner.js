import {Fiend} from '../entities/fiend.js';
import {randomFloat} from '../core/math.js';
export class Spawner{
constructor(combatSys){
this.combatSys = combatSys;
this.waveTimer = 0;
this.waveDuration = 15;
this.currentWave = 1;
this.spawnTimer = 0;
this.spawnRate = 2.0;
this.isActive = true;
}
update(dt, vesselLocX, vesselLocY){
if(!this.isActive)
return;
this.waveTimer += dt;
if(this.waveTimer >= this.waveDuration){
this.waveTimer = 0;
this.currentWave++;
this.spawnRate = Math.max(0.3, this.spawnRate - 0.15);
this.waveDuration += 2;
}

this.spawnTimer -= dt;
if(this.spawnTimer <= 0){
this.spawnTimer = this.spawnRate;
this.spawnFiend(vesselLocX, vesselLocY);
 }
}

spawnFiend(targetX, targetY){
const angle = randomFloat(0, Math.PI * 2);
const distance = 800;
const spawnX = targetX + Math.cos(angle) * distance;
const spawnY = targetY + Math.sin(angle) * distance;
let strain = 0;
const roll = Math.random();
if(this.currentWave >= 3 && roll > 0.7){
strain = 1;
}
else if(this.currentWave >= 2 && roll > 0.4){
strain = 2;
}
const fiend = new Fiend(spawnX, spawnY, strain);
this.combatSys.registerFiend(fiend);
 }
}