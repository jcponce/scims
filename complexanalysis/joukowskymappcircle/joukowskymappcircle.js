let slider;
let zoom = 70;
let start = 0;
let t;
let rd=0.23*2*2.54950975679639241501;

function setup() {
    createCanvas(400,450);
    t = new PointZ();
    //colorMode(HSB);
    slider = createSlider(0, 1, 0, 0.000001);
    slider.position(130, 415);
    slider.style('width', '150px');
    
}

function draw() {
    background(255);
    let zx = t.cx;
    let zy = t.cy;
    t.show();
    t.clicked();
    let cX;
    let cY;
    cX = map(zx,0,width,2.85,-2.85);
    cY = map(zy,height,0,-3.2,3.2);
    noFill();
    stroke(0);
    strokeWeight(1.2);
    rect(0,0,width,height);
    translate(width/2,height/2);
    rotate(PI);
    scale(zoom);
    
    //Reference xy
    stroke(255, 0, 0,100);
    strokeWeight(0.015);
    line(0,0,-1,0);
    stroke(51, 204, 51,100);
    line(0,0,0,1);
    
    fill(0);
    noStroke();
    ellipse(-2, 0, 0.1, 0.1);//xAxis
    fill(30);
    ellipse(2, 0, 0.1, 0.1);//yAxis
    fill(60);
    ellipse(0.21, 0.09, 0.1, 0.1);
    //fill(80);
    //ellipse(0, 0, 0.1, 0.1)//origin
    
    fill(23,134,230,100);
    stroke(0);
    strokeWeight(0.03);
    beginShape();
    for(let i = 0; i <= 2*PI; i+=PI/80){
        let xc = cos(i)+cX;
        let yc = sin(i)+cY;
        vertex((xc*(1-slider.value()) + JkTransX(xc,yc)*slider.value()  ),( yc*(1-slider.value())+JkTransY(xc,yc)*slider.value()));
    }
    endShape(CLOSE);
    
    //print(cX);
}

function JkTransX(x,y){
    return rd*x-0.15 + (rd*x-0.15)/((rd*x-0.15)*(rd*x-0.15)+(rd*y+0.23)*(rd*y+0.23));
}

function JkTransY(x,y){
    return rd*y+0.23 - (rd*y+0.23)/((rd*x-0.15)*(rd*x-0.15)+(rd*y+0.23)*(rd*y+0.23));
}

function PointZ(){
    this.offsetx =  0
    this.offsety = 0
    this.cx = 200
    this.cy = 200
    
    this.selected = false
    
    this.clicked = function(){
        this.offsetx = this.cx-mouseX;
        this.offsety= this.cy -mouseY;
        if (collidePointCircle(mouseX,mouseY,this.cx,this.cy,150) && mouseIsPressed){
            this.selected =true;
        }else{
            this.selected =false;
        }
        
    }
    
    this.show = function(){
        if(this.selected){
            this.cx = mouseX+this.offsetx;
            this.cy = mouseY+this.offsety;
        }
        fill(234,0,0);
        ellipse(this.cx,this.cy,15);
    }
    
}
