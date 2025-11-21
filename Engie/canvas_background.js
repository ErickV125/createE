const bgCanvas = document.getElementById('Background_canvas');
const ctxBg = bgCanvas.getContext('2d');
const colors_ui = {
    backround : '#ada694',
    dots: '#b5af9d',
    particles: '#ffffffb0',
    black:'#3c3b36',
    blackA:'#3c3b3666',
    block: '#cecab2',
    light_block : '#dedac3',
    shadow_block: '#c3beaa',

}
const windowSize = [window.innerWidth,window.innerHeight];
let cacheDots = [];

function resizeBg(){
    const ratio = window.devicePixelRatio || 1;
    windowSize[0] = window.innerWidth; 
    windowSize[1] = window.innerHeight;
    bgCanvas.width = windowSize[0]  * ratio;
    bgCanvas.height = windowSize[1] * ratio;
    ctxBg.scale(ratio, ratio);
    cacheDots = []
    for (let x = 0; x <= bgCanvas.width; x+=7){
        for (let y = 0; y <= bgCanvas.height; y+=7){
            cacheDots.push([x,y])
        }
    }
  

    
 
}


window.addEventListener('resize',()=>{
    resizeBg()
})
resizeBg()


let pastDt = 0
function updateBg(dt){
    deltaTime = dt - pastDt
    pastDt = dt
    ctxBg.fillStyle = colors_ui.backround
    ctxBg.fillRect(0,0,bgCanvas.width,bgCanvas.height)
    ctxBg.fillStyle = colors_ui.dots
    cacheDots.forEach(dot=>{
        ctxBg.beginPath();
        ctxBg.arc(dot[0],dot[1],1.5,0,2*Math.PI);
        ctxBg.fill()
        ctxBg.closePath();
    })
   

    requestAnimationFrame(updateBg)
}
requestAnimationFrame(updateBg)





//  cara.triangles.forEach((triangle)=>{
//         for(let i = 0; i< triangle.triangle_points.length;i++){
//             const point = triangle.triangle_points[i]
//             const point2= triangle.triangle_points[(i + 1) % triangle.triangle_points.length];
//             let x1 = point[0]*10+200;
//             let y1 = point[1]*10+200;
//             let x2 = point2[0]*10+200;
//             let y2 = point2[1]*10+200;
//             ctxBg.beginPath();
//             ctxBg.moveTo(x1,y1)
//             ctxBg.lineTo(x2,y2)
//             ctxBg.stroke();
//             ctxBg.closePath();

//         }
//     })
