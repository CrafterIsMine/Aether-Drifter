class FloatingText{
constructor(posX, posY, text, color){
this.locX = posX;
this.locY = posY;
this.text = text;
this.color = color;
this.lifespan = 0.8;
this.maxLife = 0.8;
this.velY = -50;
this.isExpired = false;
}
update(dt){
this.locY += this.velY * dt;
this.velY *= 0.95;
this.lifespan -= dt;
if(this.lifespan <= 0)
this.isExpired = true;
}
render(glyph){
const alpha = this.lifespan / this.maxLife;
glyph.save();
glyph.globalAlpha = alpha;
glyph.font = 'bold 16px Courier New';
glyph.textAlign = 'center';
glyph.fillStyle = this.color;
glyph.fillText(this.text, this.locX, this.locY);
glyph.restore();
}
}

export class TextSystem{
constructor(){
this.texts = [];
}

spawnText(posX, posY, text, color){
this.texts.push(new FloatingText(posX, posY, text, color));
}

update(dt){
for(let i = this.texts.length - 1; i >= 0; i--){
this.texts[i].update(dt);
if(this.texts[i].isExpired){
this.texts.splice(i, 1);
 }
}
}

render(glyph){
for (const t of this.texts){
t.render(glyph);
}
 }
}

export class HeadsUpDisplay{
constructor(){
this.margin = 20;
this.barWidth = 250;
this.barHeight = 20;
}

render(glyph, vessel, canvasWidth, canvasHeight, waveNum){
glyph.save();
const animaX = this.margin;
const animaY = this.margin;
glyph.fillStyle = '#220000';
glyph.fillRect(animaX, animaY, this.barWidth, this.barHeight);
const animaRatio = Math.max(0, vessel.anima / vessel.maxAnima);
const animaGrad = glyph.createLinearGradient(animaX, 0, animaX + this.barWidth, 0);
animaGrad.addColorStop(0, '#ff0000');
animaGrad.addColorStop(1, '#ff5555');
glyph.fillStyle = animaGrad;
glyph.fillRect(animaX, animaY, this.barWidth * animaRatio, this.barHeight);
glyph.strokeStyle = '#ffffff';
glyph.lineWidth = 2;
glyph.strokeRect(animaX, animaY, this.barWidth, this.barHeight);
glyph.fillStyle = '#ffffff';
glyph.font = '14px Courier New';
glyph.textAlign = 'left';
glyph.fillText(`ANIMA: ${Math.ceil(vessel.anima)}/${vessel.maxAnima}`, animaX + 5, animaY + 15);
const aetherY = animaY + this.barHeight + 10;
glyph.fillStyle = '#001122';
glyph.fillRect(animaX, aetherY, this.barWidth, this.barHeight);
const aetherRatio = Math.min(1, vessel.aether / 100);
const aetherGrad = glyph.createLinearGradient(animaX, 0, animaX + this.barWidth, 0);
aetherGrad.addColorStop(0, '#00ffff');
aetherGrad.addColorStop(1, '#0088ff');
glyph.fillStyle = aetherGrad;
glyph.fillRect(animaX, aetherY, this.barWidth * aetherRatio, this.barHeight);
glyph.strokeStyle = '#ffffff';
glyph.strokeRect(animaX, aetherY, this.barWidth, this.barHeight);
glyph.fillStyle = '#ffffff';
glyph.fillText(`AETHER: ${Math.floor(vessel.aether)} (MASS: ${vessel.mass.toFixed(1)}x)`, animaX + 5, aetherY + 15);
glyph.textAlign = 'right';
glyph.font = '24px Courier New';
glyph.fillStyle = '#ffffff';
glyph.fillText(`WAVE ${waveNum}`, canvasWidth - this.margin, this.margin + 20);
glyph.textAlign = 'center';
glyph.font = '12px Courier New';
glyph.fillStyle = '#888888';
glyph.fillText('WASD: MOVE | MOUSE: AIM/SHOOT | SHIFT: DASH | SPACE: PURGE AETHER', canvasWidth / 2, canvasHeight - this.margin);
glyph.restore();
 }
}
