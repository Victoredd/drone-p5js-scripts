gravity = -0;
drag_coeff = 0.1;
arm_length = 0.1;
class Drone {
  constructor(x, y, vx, vy, mass, dt, controlStrategy, rotStrategy) {
    this.position = createVector(x, y);
    this.velocity = createVector(vx, vy);
    this.force = createVector(0, 0);
    this.pforce = createVector(0, 0);
    this.cforce = createVector(0, 0);
    this.angle = 0;
    this.angularSpeed = 0;
    this.rotForce = 0;
    this.dt = dt;
    this.mass = mass;
    this.controlStrategy = controlStrategy;
    this.rotStrategy = rotStrategy;
    this.motorPower = 200 //the max amount of combined power the motors can output, in force units
  }
  
  setPhysicalForces(fx, fy) {
    this.pforce = createVector(fx, fy);
  }

  setTotalForce() {
    let motor_out = this.controlStrategy(this.position.x, this.position.y) * this.motorPower;
    this.cforce = createVector(motor_out * sin(this.angle), motor_out * cos(this.angle));
    this.force = p5.Vector.add(this.pforce, this.cforce);
    //calculate air resistance
    this.force.sub(p5.Vector.mult(this.velocity, drag_coeff));
  }

  setRotForce() {
    let delta_angle = constrain(atan(-this.position.x, -this.position.y), -QUARTER_PI, QUARTER_PI) - this.angle;
    this.rotForce = this.rotStrategy(delta_angle, this.position.y) * this.motorPower * arm_length;
    //calculate air resistance
    this.rotForce -= drag_coeff * this.angularSpeed;
  }
  
  update() {
    //rotation
    this.setRotForce();
    this.angularSpeed += this.rotForce * this.dt;
    this.angle += this.angularSpeed * this.dt;
    //movement
    this.setDeltaTime()
    this.setTotalForce()
    this.velocity.add(p5.Vector.mult(this.force, this.dt/this.mass));
    this.position.add(p5.Vector.mult(this.velocity, this.dt/this.mass));
  }

  setDeltaTime() {
    this.dt = deltaTime/1000;
  }
  
  display() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    fill("red");
    rect(-100,-10, 200, 20);
    pop();
  }
}

//CONTROLS IN MOTOR-ANGLE PAIRS
//NONE
function noControl(posX, posY) {
  return 0;
}
function noAngleControl(delta_angle, posY) {
  return 0;
}
//PROPORTIONAL
function proportionalControl(posX, posY) {
  if (posY < 0) {
    return min(1, 2*mag(posX, posY)/height);
  }
  else {
    return 0;
  }
}
function proportionalAngleControl(delta_angle, posY) {
  if (posY < 0) {
    return delta_angle / QUARTER_PI;
  }
  else {
    return 0;
  }
}

function setup() {
  createCanvas(700, 700);
  frameRate(60);
  drone = new Drone(-100, -150, 0, 0, 1, 1/60, proportionalControl, proportionalAngleControl);
  drone.setPhysicalForces(0, gravity);
}


function draw() {
  translate(width/2, height/2);
  scale(1, -1);
  background(220);
  drone.update();
  drone.display();
  fill("blue");
  circle(0, 0, 10);
}