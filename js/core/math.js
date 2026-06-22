export const computeSpan = (posA, posB)=>{
const deltaX = posB.locX - posA.locX;
const deltaY = posB.locY - posA.locY;
return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
};

export const normalizeVector = (vecX, vecY)=>{
const magnitude = Math.sqrt(vecX * vecX + vecY * vecY);
if(magnitude === 0)
return{ 
vecX: 0, vecY: 0 
 };
return {
vecX: vecX / magnitude, vecY: vecY / magnitude 
 };
};
export const lerpValues = (startVal, endVal, interpFactor)=>{
return startVal + (endVal - startVal) * interpFactor;
};
export const mapRange = (inputVal, inMin, inMax, outMin, outMax)=>{
return ((inputVal - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};
export const randomFloat = (minVal, maxVal)=>{
return Math.random() * (maxVal - minVal) + minVal;
};
export const randomInt = (minVal, maxVal)=>{
return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
};
export const clampValue = (val, minBound, maxBound)=>{
return Math.max(minBound, Math.min(maxBound, val));
};
export const degToRad = (degVal)=>{
return degVal * (Math.PI / 180);
};
export const radToDeg = (radVal)=>{
return radVal * (180 / Math.PI);
};

export const checkCircleOverlap = (circA, circB)=>{
const distSpan = computeSpan(circA, circB);
return distSpan < circA.boundRad + circB.boundRad;
};