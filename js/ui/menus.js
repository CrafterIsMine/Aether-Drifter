import {input} from '../core/input.js';
export class MenuSystem{
constructor(){
this.state = 'nexus';
this.titlePulse = 0;
}
update(dt){
this.titlePulse += dt;
if(this.state === 'nexus'){
if(input.wasKeyPressed('Space') || input.wasMouseClicked()){
this.state = 'active';
return true;
 }
} 
else if(this.state === 'terminus'){
if(input.wasKeyPressed('Space') || input.wasMouseClicked()){
this.state = 'nexus';
return true;
 }
}
return false;
}

render(glyph, canvasWidth, canvasHeight, finalWave){
if(this.state === 'nexus'){
this.renderNexus(glyph, canvasWidth, canvasHeight);
} 
else if (this.state === 'terminus'){
this.renderTerminus(glyph, canvasWidth, canvasHeight, finalWave);
 }
}

renderNexus(glyph, w, h){
glyph.fillStyle = 'rgba(5, 5, 8, 0.85)';
glyph.fillRect(0, 0, w, h);
const scale = 1 + Math.sin(this.titlePulse * 2) * 0.05;
glyph.save();
glyph.translate(w / 2, h / 2 - 100);
glyph.scale(scale, scale);
glyph.font = 'bold 64px Courier New';
glyph.textAlign = 'center';
glyph.shadowColor = '#ff00ff';
glyph.shadowBlur = 20;
glyph.fillStyle = '#ffffff';
glyph.fillText('AETHER DRIFTER', 0, 0);
glyph.restore();
glyph.font = '20px Courier New';
glyph.fillStyle = '#00ffff';
glyph.shadowColor = '#00ffff';
glyph.shadowBlur = 10;
glyph.textAlign = 'center';
glyph.fillText('ABSORB. GROW. PURGE.', w / 2, h / 2 - 20);
const blink = Math.sin(this.titlePulse * 4) > 0;
if(blink){
glyph.font = '24px Courier New';
glyph.fillStyle = '#ffffff';
glyph.shadowBlur = 0;
glyph.fillText('[ CLICK OR PRESS SPACE TO BEGIN ]', w / 2, h / 2 + 60);
}
glyph.font = '16px Courier New';
glyph.fillStyle = '#888888';
glyph.shadowBlur = 0;
glyph.fillText('Collect Aether to increase Mass and Damage.', w / 2, h / 2 + 120);
glyph.fillText('Beware: High Mass reduces Speed and increases Hitbox.', w / 2, h / 2 + 145);
glyph.fillText('Hold SPACE to purge Aether and shrink.', w / 2, h / 2 + 170);
glyph.fillText('Press SHIFT to dash (cooldown scales with Mass).', w / 2, h / 2 + 195);
}
renderTerminus(glyph, w, h, wave){
glyph.fillStyle = 'rgba(20, 0, 0, 0.85)';
glyph.fillRect(0, 0, w, h);
glyph.font = 'bold 56px Courier New';
glyph.textAlign = 'center';
glyph.shadowColor = '#ff0000';
glyph.shadowBlur = 20;
glyph.fillStyle = '#ff3333';
glyph.fillText('VESSEL SHATTERED', w / 2, h / 2 - 60);
glyph.font = '28px Courier New';
glyph.fillStyle = '#ffffff';
glyph.shadowBlur = 0;
glyph.fillText(`SURVIVED UNTIL WAVE ${wave}`, w / 2, h / 2);
const blink = Math.sin(this.titlePulse * 4) > 0;
if(blink){
glyph.font = '24px Courier New';
glyph.fillStyle = '#00ffff';
glyph.fillText('[ CLICK OR PRESS SPACE TO RESTART ]', w / 2, h / 2 + 80);
 }
}
}