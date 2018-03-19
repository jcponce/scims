/*
A cool dynamic version of velocity fields. Flow around a circle with velocity U and circulation C.
First a translation and scalling is applied to the circle C_0 with center z=0+0*i and radius |z|=1.
This is done using the map T(z)=-0.15_0.23*i + r_0*z, with r_0=0.23*sqrt(13*2) and i^2=-1.
Thus C_0 is mapped to the circle C_1 with center z1=-0.15+i*0.23 and radius r_0.
Finally the Joukowsky mapping J(z)=z+1/z is applied. Thus the circle C_1 is mapped to the Arfoil
This is known as The Joukowski Airfoil.
*/

//Warning: The code is pretty messy but I will be back later to clean it. :)

/*
Feel free to do whatever with this code.
If you do use it, I'd love to see what you did.
Send me a note at  j.ponce@uq.edu.au
 */

//http://creativecommons.org/licenses/by-nc/4.0/

let numMax = 500;
let t = 0;
let h = 0.01;
let particles = [];
let zoom;
let offset = new p5.Vector(0,0);

let a = 1;//radius

let currentParticle = 0;

let tshow = false;//trace
let starting = false;
let started = true;

let buttonTrace;

let sliderU;// Speed
let sliderC;//Circulation
let sliderT;//Tranformation using homotopy

let rd=0.23*2*2.54950975679639241501;//radius

let bx = 8; //Limit x to add particles
let by = 4; //Limit y to add particles

function setup() {
    
    createCanvas(800, 500);
    controls();
    //
    resetSketch();
    //background(0);
    
}

function resetSketch() {
    
    for (let i=0; i<numMax; i++) {
        particles[i] = new Particle(random(-bx,bx),random(-by,by),t,h);
    }
    
    tshow = false;
    starting = false;
}

function traceShow() {
    if(tshow==false) {
        tshow = true;
    }else{
        tshow = false;
    }
}

function draw() {
    
    //Initial message
    if (starting==false) {
        stroke(0);
        fill(0);
        strokeWeight(0.5);
        rect(0,0,width,height);
        fill(255);
        stroke(255);
        textSize(23);
        text("Click on screen to start", 6*width/16, height/4);
    }
    
    //This is for drawing the trace of particles
    if(tshow==true){
        fill(255,10);
    } else{
        fill(255,100);
    }
    
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

    if (starting==true) {
    for (let i=particles.length-1; i>=0; i-=1) {
        let p = particles[i];
        p.update();
        p.display();
        if ( p.x > bx ||  p.y > by || p.x < -bx ||  p.y < -by ) {
            particles.splice(i,1);
            currentParticle--;
            particles.push(new Particle(random(-bx,-bx+0.5),random(-by,by),t,h) );
        }
      }
    }
    
    //This draws the circle to be transformed
    fill(0);
    noStroke();
    beginShape();
    for(let i = 0; i <= 2*PI; i+=PI/50){
        let xc = cos(i);
        let yc = sin(i);
        vertex(-(xc*(1-sliderT.value()) + JkTransX(xc,yc)*sliderT.value()  ), yc*(1-sliderT.value())+JkTransY(xc,yc)*sliderT.value());
    }
    endShape(CLOSE)
    
    //This is the black rectangle for the controls
    noStroke();
    rect(-6,-5.9,16,3);
    
    scale(0.3);
    rotate(-PI);
    textSize(1);
    fill(255);
    text('U='+sliderU.value(), -18.8,11);
    text('C='+sliderC.value(), -9,11);
    text('T='+sliderT.value(), 3,11);
    
}

function mousePressed() {
    starting = true;
}

//This part defines the components of the velocity field
function componentFX(t, x, y){
    return 4.9*(   (2 * a*a * sliderU.value() * y*y)/((x*x+ y*y)*(x*x+ y*y)) + sliderU.value()*(1 - (a*a)/(x*x + y*y)) - (sliderC.value()*y)/(2*PI*(x*x + y*y)) );//Change this function
}

function componentFY(t, x, y){
    return 4.9*( -(2*a*a * sliderU.value() * x * y)/((x*x+ y*y)*(x*x+ y*y)) + (sliderC.value() * x)/(2*PI*(x*x + y*y)) );//Change this function
}

//This part defines the components of the Joukowsky transformation
function JkTransX(x,y){
    return rd*x-0.15 + (rd*x-0.15)/((rd*x-0.15)*(rd*x-0.15)+(rd*y+0.23)*(rd*y+0.23));
}

function JkTransY(x,y){
    return rd*y+0.23 - (rd*y+0.23)/((rd*x-0.15)*(rd*x-0.15)+(rd*y+0.23)*(rd*y+0.23));
}

//This function defines the particles and how they move. I use Runge–Kutta method of fourth degree
class Particle{
    
	constructor(_x, _y, _t, _h){
    this.x = _x;
    this.y = _y;
    this.time = _t;
    this.radius = random(0.03,0.07);
    this.h = _h;
    this.op = random(199,200);
    this.r = random(0,255);
    this.g = random(220,255);
    this.b = random(0,255);
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

/*This part defines the controls*/
function controls() {
    buttonTrace = createButton('Trace');
    buttonTrace.position(670, 470);
    buttonTrace.mousePressed(traceShow);
    
    sliderU = createSlider(0.01, 1, 0.3, 0.01);
    sliderU.position(75, 470);
    sliderU.style('width', '100px');
    
    sliderC = createSlider(-10, 10, 0, 0.01);
    sliderC.position(290, 470);
    sliderC.style('width', '100px');
    
    sliderT = createSlider(0, 1, 0, 0.01);
    sliderT.position(530, 470);
    sliderT.style('width', '100px');
    
}
