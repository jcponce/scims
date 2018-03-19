//A cool dynamic version of velocity fields- Flow with circulation around a circle
//with velocity U and circulation C.
//First a translation and scalling is applied so the circle C_0 with center z=0+0*i and radius |z|=1
//is mapped to the circle C_1 with center z1=-0.15+i*0.23 and radius r_0=2*0.23*sqrt(13/2).
//Finally the Joukowsky mapping (z+1/z) is applied. Thus the circle C_1 is mapped to the Arifoil
//This is known as The Joukowski Airfoil.

//The code is pretty messy but I will be back later to clean it. :)

//http://creativecommons.org/licenses/by-nc/4.0/


let numMax = 900;
let t = 0;
let h = 0.01;
let particles = [];
let zoom;
let offset = new p5.Vector(0,0);

let a = 1;//radius

let currentParticle = 0;

let sliderU;
let sliderC;
let sliderT;

let rd=0.23*2*2.54950975679639241501;

function setup() {
    createCanvas(800, 500);
    controls();
}

function draw() {
  
    fill(255,50);
    stroke(255);
    strokeWeight(0.5);
    rect(0,0,width,height);
    
    zoom = 70;
    
    translate(width/2,height/2);
    scale(zoom);
    rotate(PI);
    translate(offset.x/zoom, offset.y/zoom);
    
    //Reference xy
    stroke(255, 0, 0,100);
    strokeWeight(0.015);
    line(0,0,-1,0);
    stroke(51, 204, 51,100);
    line(0,0,0,1);
    
    t += h;
    
    if(mouseIsPressed){
        let addx = map(mouseX,0,width,(-6)*(1-sliderT.value())+(-4.5)*sliderT.value(),(6)*(1-sliderT.value())+(4.5)*sliderT.value());
        let addy = map(mouseY,height,0,(-4)*(1-sliderT.value())+(-3.2)*sliderT.value(),(4)*(1-sliderT.value())+(3)*sliderT.value());
        let splatter = 0.4;
        particles[currentParticle] = new Particle(addx+random(-splatter, splatter), addy+random(-splatter, splatter), t, h);
        currentParticle++;
        if (currentParticle >= numMax)
        {
            currentParticle = 0;
        }
    }
    
    for (let i=particles.length-1; i>=0; i-=1) {
        let p = particles[i];
        p.update();
        p.display();
        if ( p.x > 6 ||  p.y > 4 || p.x < -6 ||  p.y < -4 ) {
            particles.splice(i,1);
            currentParticle--;
        }
    }
    
    fill(0);
    noStroke();
    beginShape();
    for(let i = 0; i <= 2*PI; i+=PI/50){
        let xc = cos(i);
        let yc = sin(i);
        vertex(-(xc*(1-sliderT.value()) + JkTransX(xc,yc)*sliderT.value()  ), yc*(1-sliderT.value())+JkTransY(xc,yc)*sliderT.value());
    }
    endShape(CLOSE)
    
    noStroke();
    rect(-6,-5.9,16,3);
    
    scale(0.3);
    rotate(-PI);
    textSize(1);
    fill(255);
    text('U='+sliderU.value(), -18.7,11);
    text('C='+sliderC.value(), -8.7,11);
    text('T='+sliderT.value(), 3,11);
    
}

function mousePressed(){
    if(mouseButton == RIGHT){
        if (fieldShow == false) {
            fieldShow = true;
        } else {
            fieldShow = false;
        }
    }
}

function componentFX(t, x, y){
    return 4.9*( (2 * a*a * sliderU.value() * y*y)/((x*x+ y*y)*(x*x+ y*y)) + sliderU.value()*(1 - (a*a)/(x*x + y*y)) - (sliderC.value()*y)/(2*PI*(x*x + y*y)) );//Change this function
}

function componentFY(t, x, y){
    return 4.9*( -(2*a*a * sliderU.value() * x * y)/((x*x+ y*y)*(x*x+ y*y)) + (sliderC.value() * x)/(2*PI*(x*x + y*y)) );//Change this function
}

function JkTransX(x,y){
    return rd*x-0.15 + (rd*x-0.15)/((rd*x-0.15)*(rd*x-0.15)+(rd*y+0.23)*(rd*y+0.23));
}

function JkTransY(x,y){
    return rd*y+0.23 - (rd*y+0.23)/((rd*x-0.15)*(rd*x-0.15)+(rd*y+0.23)*(rd*y+0.23));
}

//Define particles and how they are moved with Runge–Kutta method of 4th degree.
class Particle{
    
    constructor(_x, _y, _t, _h){
        this.x = _x;
        this.y = _y;
        this.time = _t;
        this.radius = random(0.03,0.09);
        this.h = _h;
        this.op = random(187,200);
        this.r = random(0,255);
        this.g = random(164,255);
        this.b = random(0,255);
        //this.lifespan = 700.0;
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
        ellipse(-(this.x*(1-sliderT.value()) + JkTransX(this.x,this.y)*sliderT.value()  ),this.y*(1-sliderT.value())+ JkTransY(this.x,this.y)*sliderT.value(), 2*this.radius, 2*this.radius);
    }
    
}

function controls() {
    
    sliderU = createSlider(0.01, 1, 0.3, 0.01);
    sliderU.position(74, 470);
    sliderU.style('width', '100px');
    
    sliderC = createSlider(-10, 10, 0, 0.01);
    sliderC.position(291, 470);
    sliderC.style('width', '100px');
    
    sliderT = createSlider(0, 1, 0, 0.01);
    sliderT.position(530, 470);
    sliderT.style('width', '100px');
    
}
