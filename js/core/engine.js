import{input} from './input.js';
class EngineCore{
constructor(){
this.scrim = document.getElementById('scrim');
this.glyph = this.scrim.getContext('2d');
this.chronosActive = false;
this.lastTick = 0;
this.deltaTime = 0;
this.frameAccumulator = 0;
this.tickRate = 1000 / 60;
this.systems = [];
this.resizeScrim();
window.addEventListener('resize', () => this.resizeScrim());
}
resizeScrim(){
this.scrim.width = window.innerWidth;
this.scrim.height = window.innerHeight;
this.centerX = this.scrim.width / 2;
this.centerY = this.scrim.height / 2;
}
registerSystem(sys){
this.systems.push(sys);
}
awaken(){
this.chronosActive = true;
this.lastTick = performance.now();
requestAnimationFrame((t) => this.chronosTick(t));
}
chronosTick(currentTime){
if(!this.chronosActive)
return;
this.deltaTime = (currentTime - this.lastTick)/1000;
this.lastTick = currentTime;
if(this.deltaTime > 0.1)
this.deltaTime = 0.1;
this.frameAccumulator += this.deltaTime;

while(this.frameAccumulator >= this.tickRate / 1000){
this.updateSystems(this.tickRate / 1000);
this.frameAccumulator -= this.tickRate / 1000;
 }

this.renderFrame();
input.clearFrameState();
requestAnimationFrame((t) => this.chronosTick(t));
 } 
updateSystems(dt){
for(const sys of this.systems){
if(sys.update)
sys.update(dt);
  }
}
renderFrame(){
this.glyph.clearRect(0, 0, this.scrim.width, this.scrim.height);
for(const sys of this.systems){
if(sys.render)
sys.render(this.glyph);
 }
   }
}
export const engine = new EngineCore();