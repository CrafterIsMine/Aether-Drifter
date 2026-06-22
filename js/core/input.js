class InputHandler{
constructor(){
this.keyState = {};
this.keyPressed = {};
this.mouseLocX = 0;
this.mouseLocY = 0;
this.mouseDepressed = false;
this.mouseClicked = false;
window.addEventListener('keydown',(evt)=>{
if(!this.keyState[evt.code]){
this.keyPressed[evt.code] = true;
}
this.keyState[evt.code] = true;
});

window.addEventListener('keyup',(evt)=>{
this.keyState[evt.code] = false;
});

window.addEventListener('mousemove',(evt)=>{
const rect = evt.target.getBoundingClientRect();
this.mouseLocX = evt.clientX - rect.left;
this.mouseLocY = evt.clientY - rect.top;
 });
window.addEventListener('mousedown',()=>{
this.mouseDepressed = true;
this.mouseClicked = true;
});
window.addEventListener('mouseup',()=>{
this.mouseDepressed = false;
  });
}
isKeyHeld(code){
return !!this.keyState[code];
}

wasKeyPressed(code){
return !!this.keyPressed[code];
}

isMouseHeld(){
return this.mouseDepressed;
}

wasMouseClicked(){
return this.mouseClicked;
}

clearFrameState(){
this.keyPressed = {};
this.mouseClicked = false;
 }
}
export const input = new InputHandler();