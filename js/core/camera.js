import {lerpValues, randomFloat } from './math.js';
class OpticCamera{
constructor(){
this.focusX = 0;
this.focusY = 0;
this.targetX = 0;
this.targetY = 0;
this.zoomLevel = 1.0;
this.shakeIntensity = 0;
this.shakeDecay = 0.9;
this.offsetX = 0;
this.offsetY = 0;
}
followTarget(entity){
this.targetX = entity.locX;
this.targetY = entity.locY;
}
induceShake(intensity){
this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
}

update(dt){
this.focusX = lerpValues(this.focusX, this.targetX, 5 * dt);
this.focusY = lerpValues(this.focusY, this.targetY, 5 * dt);
if(this.shakeIntensity > 0.5){
this.offsetX = randomFloat(-this.shakeIntensity, this.shakeIntensity);
this.offsetY = randomFloat(-this.shakeIntensity, this.shakeIntensity);
this.shakeIntensity *= this.shakeDecay;
}
else{
this.offsetX = 0;
this.offsetY = 0;
this.shakeIntensity = 0;
 }
}
applyTransform(glyph, canvasWidth, canvasHeight){
glyph.save();
glyph.translate(canvasWidth / 2, canvasHeight / 2);
glyph.scale(this.zoomLevel, this.zoomLevel);
glyph.translate(-this.focusX + this.offsetX, -this.focusY + this.offsetY);
 } 
revertTransform(glyph){
glyph.restore();
}
screenToWorld(screenX, screenY, canvasWidth, canvasHeight){
const worldX = (screenX - canvasWidth / 2) / this.zoomLevel + this.focusX;
const worldY = (screenY - canvasHeight / 2) / this.zoomLevel + this.focusY;
return{
locX: worldX, locY: worldY 
 };
   }
}
export const optic = new OpticCamera();