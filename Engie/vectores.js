function add(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]];
}
function sub(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1]];
}
function mult(V1,escalar){
    return [V1[0] * escalar,V1[1] * escalar]
}
function mod(V1){
    return Math.sqrt((V1[0])**2 + (V1[1])**2)
}
function unit(V1){
    const m = mod(V1);
    if (m === 0) return [0, 0];
    return [V1[0]/m,V1[1]/m]
}
function dot(V1,V2){
    return V1[0] * V2[0] + V1[1] * V2[1] 
}
function cross(v1, v2) {
    return v1[0]*v2[1] - v1[1]*v2[0];
}
function angleBetween(v1, v2) {
    return Math.acos(dot(v1, v2) / (mod(v1) * mod(v2)));
}

function add3(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1],v1[2] + v2[2] ];
}
function sub3(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1],v1[2] - v2[2]];
}
function mult3(V1,escalar){
    return [V1[0] * escalar,V1[1] * escalar,V1[2] * escalar]
}
function mod3(V1){
    return Math.sqrt((V1[0])**2 + (V1[1])**2 + (V1[2])**2)
}
function unit3(V1){
    const m = mod3(V1);
    if (m === 0) return [0, 0,0];
    return [V1[0]/m,V1[1]/m,V1[2]/m]
}

function dot3(V1,V2){
    return V1[0] * V2[0] + V1[1] * V2[1] + V1[2] * V2[2]
}

function cross3(V1,V2) {
    return [
        V1[1]*V2[2] - V1[2]*V2[1],
        V1[2]*V2[0] - V1[0]*V2[2],
        V1[0]*V2[1] - V1[1]*V2[0]
    ];
}

function angleBetween3(v1, v2) {
    return Math.acos(dot3(a,b) / (mag3(a)*mag3(b)));return Math.acos(dot(v1, v2) / (mod(v1) * mod(v2)));
}