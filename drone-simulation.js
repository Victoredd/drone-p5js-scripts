gravity = 0;
drag_coeff = 0.1;
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
    this.motorPower = 900 //the max amount of combined power the motors can output, in force units
  }
  
  setPhysicalForces(fx, fy) {
    this.pforce = createVector(fx, fy);
  }

  setTotalForce() {
    this.cforce = p5.Vector.mult(this.controlStrategy(this.position.x, this.position.y), this.motorPower);
    this.force = p5.Vector.add(this.pforce, this.cforce);
    //calculate air resistance
      this.force.add(0, -drag_coeff*this.velocity.y);
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
    fill("red");
    rect(this.position.x - 100, this.position.y - 10, 200, 20);
  }
}

//control methods
function noControl(posX, posY, i, d) {
  return createVector(0, 0);
}

function bangBangControl(posX, posY, i, d) {
  if (posY > 0) {
    return createVector(0, -1);
  }
  else {
    return createVector(0, 0);
  }
}

function bidirectionalBangBangControl(posX, posY, i, d) {
  if (posY > 0) {
    return createVector(0, -1);
  }
  else {
    return createVector(0, 1);
  }
}

function proportionalControl(posX, posY, p, i, d) {
  return createVector(0, -2*posY/height);
}

function setup() {
  createCanvas(700, 700);
  frameRate(60);
  drone = new Drone(0, 150, 0, 0, 1, 1/60, proportionalControl);
  drone.setPhysicalForces(0, gravity);
}


function draw() {
  translate(width/2, height/2);
  background(220);
  drone.update();
  drone.display();
  fill("blue");
  circle(0, 0, 10);
}