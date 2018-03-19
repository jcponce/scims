/* Near a wall simulation designed with p5.js (https://p5js.org/)
 Under Creative Commons License
 https://creativecommons.org/licenses/by-sa/4.0/
 
 Writen by Juan Carlos Ponce Campuzano, 19-August-2017
 */

let numMax = 600;
let t = 0;
let h = 0.01;
let particles = [];
let zoom;
let offset = new p5.Vector(0,0);

//vector field variables
let xmax = 6;
let xmin = -6;
let ymax = 8;
let ymin = 0;
let sc = 0.15;
let xstep = 0.6;
let ystep = 0.6;

let bx = 7;
let by = 8;

let currentParticle = 0;

let fshow = false;
let tshow = false;
let starting = false;

let buttonField;
let buttonTrace;
let sliderk;

function setup() {
    createCanvas(700, 500);
    controls();
    resetSketch();
}

function resetSketch() {
    
    for (let i=0; i<numMax; i++) {
        particles[i] = new Particle(random(-bx,bx),random(0,by),t,h);
    }
    fshow = false;
    tshow = false;
    
}

function fieldShow() {
    
    if(fshow==false) {
        fshow = true;
    } else{
        fshow = false;
    }
    
    if(tshow==true) {
        tshow = false;
    }
    
}

function traceShow() {
    if(tshow==false) {
        tshow = true;
    }else{
        tshow = false;
    }
    
    if(fshow==true) {
        fshow = false;
    }
    
}

function draw() {
    
    //This is for drawing the trace of particles
    if(tshow==true){
        fill(0,6);
    } else{
        fill(0,110);
    }
    noStroke();
    rect(0,0,width,height);
    
    //Initial message
    if (starting==false) {
        fill(255);
        stroke(255);
        textAlign(CENTER);
        textSize(32);
        text("Click on screen to start", width/2, height/2);
    }
    
    zoom = 50;
    
    translate(width/2,height/2+180);
    scale(zoom);
    rotate(PI);
    translate(offset.x/zoom, offset.y/zoom);
    
    if(starting==true) {
        
        //Reference xy
        stroke(255, 0, 0,100);
        strokeWeight(0.015);
        line(0,0,-1,0);
        stroke(51, 204, 51,100);
        line(0,0,0,1);
        
        t += h;
        
        for (let i=particles.length-1; i>=0; i-=1) {
            let p = particles[i];
            p.update();
            p.display();
            if ( p.x > bx ||  p.y > by || p.x < -bx ||  p.y < 0 ) {
                particles.splice(i,1);
                currentParticle--;
                particles.push(new Particle(random(-bx,bx),random(0,by),t,h) );
            }
        }
        
        if(fshow == true){
            field(t);
        }
        
    }
    
    stroke(200);
    strokeWeight(0.01);
    fill(0);
    rect(-8,-2.1,15,2);
    
    scale(0.3);
    rotate(-PI);
    textSize(1);
    fill(250);
    text('k= '+nfc(sliderk.value(),1,1),-2.5,1.7);//for slider k
    
}

function mousePressed() {
    starting = true;
}

function componentFX(t, x, y){
    return ( sliderk.value()*x );//Change this function
}

function componentFY(t, x, y){
    return (  sliderk.value()*(-y) );//Change this function
}

//Define particles and how they are moved with Runge–Kutta method of 4th degree.
class Particle{
    
   constructor(_x, _y, _t, _h){
    this.x = _x;
    this.y = _y;
    this.time = _t;
    this.radius = random(0.03,0.07);
    this.h = _h;
    this.op = random(187,200);
    this.r = random(0);
    this.g = random(164,255);
    this.b = random(255);
	}
    
    update() {
        this.k1 = componentFX(this.time, this.x, this.y);
        this.j1 = componentFY(this.time, this.x, this.y);
        this.k2 = componentFX(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1);
        this.j2 = componentFY(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1);
        this.k3 = componentFX(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2);
        this.j3 = componentFY(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2);
        this.k4 = componentFX(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3);
        this.j4 = componentFY(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3);
        this.x = this.x + this.h/6 *(this.k1 + 2 * this.k2 + 2 * this.k3 + this.k4);
        this.y = this.y + this.h/6 *(this.j1 + 2 * this.j2 + 2 * this.j3 + this.j4);
        this.time += this.h;
    }
    
    display() {
        fill(this.r, this.b, this.g, this.op);
        noStroke();
        ellipse(-(this.x),this.y, 2*this.radius, 2*this.radius);
    }
    
}

//Set sliders and buttons
function controls() {

    sliderk = createSlider(0, 1.5, 0.5, 0.1);
    sliderk.position(230, 470);
    sliderk.style('width', '150px');
    
    buttonField = createButton('Field');
    buttonField.position(590, 464);
    buttonField.mousePressed(fieldShow);
    
    buttonTrace = createButton('Trace');
    buttonTrace.position(520, 464);
    buttonTrace.mousePressed(traceShow);
    
}

//Vector field
function field(_time) {
    this.time = _time;
    for(let k=ymin; k<=ymax; k+=ystep){
        for(let j=xmin; j<=xmax; j+=xstep){
            let xx = j + sc * componentFX(this.time,j,k);
            let yy = k + sc * componentFY(this.time,j,k);
            stroke(200);
            strokeWeight(0.01);
            line(-j, k, -xx, yy );
        }
    }
}
