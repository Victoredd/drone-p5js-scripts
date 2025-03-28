class Drone {
  constructor(x, y, vx, vy, mass, dt, controlStrategy) {
    this.position = createVector(x, y);
    this.velocity = createVector(vx, vy);
    this.force = createVector(0, 0);
    this.pforce = createVector(0, 0);
    this.cforce = createVector(0, 0);
    this.dt = dt;
    this.mass = mass;
    this.controlStrategy = controlStrategy;
    this.motorPower = 200 //the max amount of combined power the motors can output, in force units
  }
  
  setPhysicalForces(fx, fy) {
    this.pforce = createVector(fx, fy);
  }

  setTotalForce() {
    this.controlStrategy(0, 0);
    this.force = p5.Vector.add(this.pforce, this.cforce);
  }
  
  update() {
    this.setDeltaTime()
    this.setTotalForce()
    this.velocity.add(p5.Vector.mult(this.force, this.dt/this.mass));
    this.position.add(p5.Vector.mult(this.velocity, this.dt/this.mass));
  }

  setDeltaTime() {
    this.dt = deltaTime/1000;
  }
  
  display() {
    translate(width/2, height/2);
    fill("red");
    rect(this.position.x - 100, this.position.y - 10, 200, 20);
  }
  //control methods

  bangBangControl(obPosX, obPosY) {
    
  }

  noControl(obPosX, obPosY) {
    this.cforce = createVector(0, 0);
  }

}

function setup() {
  createCanvas(700, 700);
  frameRate(60);
  drone = new Drone(0, 0, 0, 0, 1, 1/60, Drone.noControl);
  drone.setPhysicalForces(0, 50);
}


function draw() {
  background(220);
  drone.update();
  drone.display();
}