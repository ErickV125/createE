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
let cachedParticles = [];
let cacheCirculos = [];
let lineasCache = [];
class Particle {
    static minSpeed = 0.3;    // Velocidad mínima (para que sea visible pero suave)
    static maxSpeed = 1.2;    // Velocidad máxima
    static lifeTime = 180;    // Frames que dura un ciclo completo (ajustable)

    constructor() {
        this.reset();
        this.color = colors_ui.particles || "#ffffff";
    }

    // Reinicia la partícula con nuevos puntos A → B
    reset() {
        // Punto de inicio (A)
        this.x = Math.random() * bgCanvas.width;
        this.y = Math.random() * bgCanvas.height;

        // Punto final (B) - cercano al inicio para efecto sutil
        this.targetX = this.x + (Math.random() - 0.5) * 80; // ±40px máx
        this.targetY = this.y + (Math.random() - 0.5) * 80;

        // Aseguramos que B esté dentro del canvas
        this.targetX = Math.max(0, Math.min(bgCanvas.width, this.targetX));
        this.targetY = Math.max(0, Math.min(bgCanvas.height, this.targetY));

        // Velocidad calculada según distancia
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = Particle.minSpeed + Math.random() * (Particle.maxSpeed - Particle.minSpeed);

        this.vx = (dx / distance) * speed || (Math.random() - 0.5) * speed; // evita división por cero
        this.vy = (dy / distance) * speed || (Math.random() - 0.5) * speed;

        this.progress = 0;           // 0 = en A, 1 = en B
        this.opacity = 0;            // Inicia invisible
        this.age = 0;                // Frames vividos en este ciclo
    }

    update() {
        this.age++;

        // Avanzamos el progreso (0 → 1 durante el ciclo)
        this.progress = this.age / Particle.lifeTime;

        if (this.progress >= 1) {
            // Llegó al final → reiniciar
            this.reset();
            return this;
        }

        // Movimiento suave (easing opcional: aquí lineal, puedes usar easeOutQuad si quieres)
        const ease = this.progress; // o usa una función de easing para más naturalidad

        this.x = this.x + this.vx;
        this.y = this.y + this.vy;

        // Actualizar opacidad: 0 → 1 → 0 (curva suave tipo campana)
        // Usamos una función sinusoidal para que suba y baje suavemente
        this.opacity = Math.sin(this.progress * Math.PI);  // 0 → 1 → 0 perfectamente

        return this;
    }
    render() {
        ctxBg.globalAlpha = Math.max(0, Math.min(1, this.opacity)); // clamp entre 0 y 1
        ctxBg.fillStyle = this.color;
        ctxBg.beginPath();
        ctxBg.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctxBg.fill();
        ctxBg.globalAlpha = 1; // restaurar
        return this;
    }
}
class Circulos{
    constructor(x,y,rmin,rmax,rtime){
        this.x = x;
        this.y = y;
        this.rmin = rmin;
        this.rmax = rmax;
        this.r = rmin;
        this.rtime = rtime;
        this.increment = true;
    }
    process(dt){
        if( this.r <= this.rmax && this.increment){
            this.r += dt * this.rtime 
        }else if(this.rmax <= this.r){
            this.increment = false
        }
        if( this.r > this.rmin && !this.increment){
            this.r -= dt * this.rtime
        }else if(this.rmin >= this.r){
            this.increment = true
        }
        
        return this
        
    }
    render(){
        ctxBg.strokeStyle = colors_ui.blackA
        ctxBg.beginPath();
        ctxBg.arc(this.x, this.y,this.r, 0, Math.PI * 2);
        ctxBg.lineWidth = 2;
        ctxBg.stroke()
        ctxBg.closePath();
    }
}
class Lineas{
    static velMin = -5;
    static velMax = 5;
    constructor(p1,p2,maxRange){
        this.coords = [p1,p2]; //[[x1,y1],[x2,y2]] 
        this.move = [0,0];
        this.maxRange = maxRange;
        this.returning = false;
        this.vector = [Math.random() * Lineas.velMax + Lineas.velMin  ,Math.random() * Lineas.velMax + Lineas.velMin ]
    }
    update(dt){
        this.coords[0][0] += this.vector[0] *dt
        this.coords[0][1] += this.vector[1] *dt

        this.coords[1][0] += this.vector[0] *dt
        this.coords[1][1] += this.vector[1] *dt
        
        
        if(this.move[0] >= this.maxRange && this.move[1] >= this.maxRange){  
            this.vector = [this.vector[0] *-1, this.vector[0]*-1]
            this.returning = true;
        }else if(!this.returning){
            this.move[0] += Math.abs(this.vector[0]) *dt ;
            this.move[1] += Math.abs(this.vector[1]) *dt; 
        }
        if(this.returning){
            this.move[0] -= Math.abs(this.vector[0]) *dt;
            this.move[1] -= Math.abs(this.vector[1]) *dt; 
        }
    
        if(this.returning && this.move[0] <= 0 && this.move[1] <= 0){
            this.returning = false;
            this.vector = [Math.random() * Lineas.velMax + Lineas.velMin  ,Math.random() * Lineas.velMax + Lineas.velMin ]

        }


        return this;
    }
    render(){
        ctxBg.beginPath();
        ctxBg.moveTo(this.coords[1][0],this.coords[1][1]);

        ctxBg.lineTo(this.coords[0][0],this.coords[0][1]);
        ctxBg.lineWidth = 2
        ctxBg.strokeStyle = colors_ui.blackA;
        ctxBg.stroke()
        ctxBg.closePath();
        return this;

    }


}
function resizeBg(){
    const ratio = window.devicePixelRatio || 1;
    windowSize[0] = window.innerWidth; 
    windowSize[1] = window.innerHeight;
    bgCanvas.width = windowSize[0]  * ratio;
    bgCanvas.height = windowSize[1] * ratio;
    ctxBg.scale(ratio, ratio);
    cacheDots = []
    for (let x = 0; x <= bgCanvas.width; x+=10){
        for (let y = 0; y <= bgCanvas.height; y+=10){
            cacheDots.push([x,y])
        }
    }
    cachedParticles = []
    for (let i = 0; i <= 25; i++ ){
        cachedParticles.push(new Particle())
    }
    cacheCirculos = []
    cacheCirculos.push(new Circulos(100,100,480,600,1));
    cacheCirculos.push(new Circulos(100,100,500,600,2));
    cacheCirculos.push(new Circulos(bgCanvas.width-100,bgCanvas.height-100,480,600,1));
    cacheCirculos.push(new Circulos(bgCanvas.width-100,bgCanvas.height-100,500,600,2));
    
    lineasCache = [];
    lineasCache.push(new Lineas([0,0],   [bgCanvas.width/2-200,  bgCanvas.height/2+400],20))
    lineasCache.push(new Lineas([100,0], [bgCanvas.width/2-300,  bgCanvas.height/2+200],20))
    lineasCache.push(new Lineas([-100,0],[bgCanvas.width/2-400,  bgCanvas.height/2+300],20))
    lineasCache.push(new Lineas([bgCanvas.width/2+200,bgCanvas.height/2-400],[bgCanvas.width,bgCanvas.height+100],20))
    lineasCache.push(new Lineas([bgCanvas.width/2+300,bgCanvas.height/2-400],[bgCanvas.width+100,bgCanvas.height+100],20))
    lineasCache.push(new Lineas([bgCanvas.width/2+100,bgCanvas.height/2-400],[bgCanvas.width-100,bgCanvas.height+200],20))

    
 
}


window.addEventListener('resize',()=>{
    resizeBg()
})
resizeBg()

pastDt = 0
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
    cachedParticles.forEach(p=>{p.update().render();})
    cacheCirculos.forEach(c =>{ c.process(deltaTime/1000).render()})
    lineasCache.forEach(l =>{ l.update(deltaTime/1000).render()})

    requestAnimationFrame(updateBg)
}
requestAnimationFrame(updateBg)






