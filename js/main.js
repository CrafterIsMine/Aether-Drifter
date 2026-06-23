import {engine} from './core/engine.js';
import {optic} from './core/camera.js';
import {input} from './core/input.js';
import {synth} from './core/synth.js';
import {Vessel} from './entities/vessel.js';
import {Bolt} from './entities/bolt.js';
import {CombatSystem} from './systems/combat.js';
import {ParticleSystem} from './systems/particles.js';
import {Spawner} from './systems/spawner.js';
import {EnvironmentSystem} from './systems/environment.js';
import {HeadsUpDisplay, TextSystem} from './ui/hud.js';
import {MenuSystem} from './ui/menus.js';

class GameDirector{
constructor(){
this.vessel = null;
this.combatSys = new CombatSystem();
this.particleSys = new ParticleSystem();
this.textSys = new TextSystem();
this.spawner = new Spawner(this.combatSys);
this.envSys = new EnvironmentSystem();
this.hud = new HeadsUpDisplay();
this.menus = new MenuSystem();
this.riteState = 'menu';
engine.registerSystem(this);
}

initiateRite(){
synth.initialize();
this.vessel = new Vessel(0, 0);
this.combatSys.bolts = [];
this.combatSys.fiends = [];
this.particleSys.sparks = [];
this.particleSys.rings = [];
this.textSys.texts = [];
this.spawner = new Spawner(this.combatSys);
this.spawner.isActive = true;
optic.focusX = 0;
optic.focusY = 0;
this.riteState = 'active';
this.menus.state = 'active';
}

update(dt){
if(this.menus.state === 'nexus' || this.menus.state === 'terminus'){
const stateChanged = this.menus.update(dt);
if(stateChanged && this.menus.state === 'active'){
this.initiateRite();
 }
return;
}
if(this.riteState === 'active'){
this.vessel.update(dt);
optic.followTarget(this.vessel);
if(input.isMouseHeld() && this.vessel.fireCooldown <= 0){
this.vessel.fireCooldown = this.vessel.fireRate;
const bolt = new Bolt(this.vessel.locX, this.vessel.locY, this.vessel.angle, 15, this.vessel.mass);
this.combatSys.registerBolt(bolt);
this.particleSys.emitBurst(this.vessel.locX + Math.cos(this.vessel.angle) * this.vessel.boundRad, this.vessel.locY + Math.sin(this.vessel.angle) * this.vessel.boundRad, 'rgb(255, 100, 255)', 3);
synth.triggerShoot(this.vessel.mass);
}
if(this.vessel.trailTimer <= 0 && (this.vessel.velX !== 0 || this.vessel.velY !== 0)){
this.vessel.trailTimer = 0.05;
const trailColor = this.vessel.isPurging ? 'rgb(0, 255, 255)' : 'rgb(255, 0, 255)';
this.particleSys.emitTrail(this.vessel.locX, this.vessel.locY, trailColor);
}
if(this.vessel.isPurging && Math.random() > 0.5){
synth.triggerPurge();
}
this.combatSys.update(dt, this.vessel, this.particleSys, this.textSys);
this.spawner.update(dt, this.vessel.locX, this.vessel.locY);
this.particleSys.update(dt);
this.textSys.update(dt);
this.envSys.update(dt);

if(this.vessel.anima <= 0){
this.riteState = 'ended';
this.menus.state = 'terminus';
this.spawner.isActive = false;
this.particleSys.emitBurst(this.vessel.locX, this.vessel.locY, 'rgb(255, 255, 255)', 50);
 }
}

optic.update(dt);
}
render(glyph){
if(this.riteState === 'menu'){
this.menus.render(glyph, engine.scrim.width, engine.scrim.height, 0);
return;
}

this.envSys.render(glyph, optic.focusX, optic.focusY, engine.scrim.width, engine.scrim.height);
optic.applyTransform(glyph, engine.scrim.width, engine.scrim.height);
this.renderGrid(glyph);
this.particleSys.render(glyph);
this.combatSys.render(glyph);
this.textSys.render(glyph);
if(this.riteState === 'active'){
this.vessel.render(glyph);
}
optic.revertTransform(glyph);
if(this.riteState === 'active'){
this.hud.render(glyph, this.vessel, engine.scrim.width, engine.scrim.height, this.spawner.currentWave);
}
else if(this.riteState === 'ended'){
this.hud.render(glyph, this.vessel, engine.scrim.width, engine.scrim.height, this.spawner.currentWave);
this.menus.render(glyph, engine.scrim.width, engine.scrim.height, this.spawner.currentWave);
}
}
renderGrid(glyph){
const gridSize = 100;
const startX = Math.floor((optic.focusX - engine.scrim.width / 2) / gridSize) * gridSize;
const startY = Math.floor((optic.focusY - engine.scrim.height / 2) / gridSize) * gridSize;
const endX = startX + engine.scrim.width + gridSize * 2;
const endY = startY + engine.scrim.height + gridSize * 2;
glyph.strokeStyle = 'rgba(50, 50, 80, 0.3)';
glyph.lineWidth = 1;
glyph.beginPath();
for(let x = startX; x <= endX; x += gridSize){
glyph.moveTo(x, startY);
glyph.lineTo(x, endY);
}
for(let y = startY; y <= endY; y += gridSize){
glyph.moveTo(startX, y);
glyph.lineTo(endX, y);
}
glyph.stroke();
 }
}
const director = new GameDirector();
engine.awaken();
