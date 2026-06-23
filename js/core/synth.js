class AudioSynth{
constructor(){
this.ctx = null;
this.masterGain = null;
this.isInitialized = false;
}
initialize(){
if(this.isInitialized)
return;
try{
this.ctx = new(window.AudioContext || window.webkitAudioContext)();
this.masterGain = this.ctx.createGain();
this.masterGain.gain.value = 0.3;
this.masterGain.connect(this.ctx.destination);
this.isInitialized = true;
} 
catch (e){
this.isInitialized = false;
 }
}

playTone(freq, duration, type, volume){
if(!this.isInitialized)
return;
if(this.ctx.state === 'suspended')
this.ctx.resume();
const osc = this.ctx.createOscillator();
const gain = this.ctx.createGain();
osc.type = type;
osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
gain.gain.setValueAtTime(volume, this.ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
osc.connect(gain);
gain.connect(this.masterGain);
osc.start(this.ctx.currentTime);
osc.stop(this.ctx.currentTime + duration);
}

playNoise(duration, volume){
if(!this.isInitialized)
return;
if(this.ctx.state === 'suspended')
this.ctx.resume();
const bufferSize = this.ctx.sampleRate * duration;
const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
const data = buffer.getChannelData(0);

for(let i = 0; i < bufferSize; i++){
data[i] = Math.random() * 2 - 1;
}

const noise = this.ctx.createBufferSource();
noise.buffer = buffer;
const gain = this.ctx.createGain();
gain.gain.setValueAtTime(volume, this.ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration)
const filter = this.ctx.createBiquadFilter();
filter.type = 'highpass';
filter.frequency.value = 1000;
noise.connect(filter);
filter.connect(gain);
gain.connect(this.masterGain);
noise.start();
}

triggerShoot(mass){
const freq = 400 + (mass * 100);
this.playTone(freq, 0.1, 'square', 0.1);
}

triggerHit(){
this.playNoise(0.05, 0.2);
this.playTone(150, 0.1, 'sawtooth', 0.1);
}

triggerExplosion(){
this.playNoise(0.3, 0.4);
this.playTone(80, 0.4, 'sawtooth', 0.2);
}

triggerDash(){
this.playTone(800, 0.15, 'sine', 0.15);
}

triggerPurge(){
this.playTone(1200, 0.2, 'sine', 0.1);
}
}
export const synth = new AudioSynth();