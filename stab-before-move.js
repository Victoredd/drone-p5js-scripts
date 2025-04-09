angle_tolerance = 0.2;
motorStrength = 250;
rotCoeff = 1;
dragCoeff = 0.2;
class Drone {
  constructor(x, y, angle) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.angle = angle; //half pi is straight up
    this.angularVelocity = 0;
    this.motor1 = 0;
    this.motor2 = 0;
    this.natForces = createVector(0, 0);
  }

  display() {
    push();
    scale(1, -1);
    translate(this.position.x, this.position.y);
    rotate(this.angle - HALF_PI);
    fill("red");
    rect(-100, 10, 200, -20);
    fill("green");
    triangle(-5, -4, 5, -4, 0, 5);
    pop();
    text("Angle: " + this.angle * 180 / PI, 20, 20)
    text("Distance to Center: " + sqrt(this.position.x * this.position.x + this.position.y * this.position.y), 20, 40);
    fill("blue");
    circle(0, 0, 10);
  }

    update() {
        let angle_to_center = abs(atan2(this.position.y, this.position.x) - HALF_PI);
        // pass off control to movement/angle depending on position
        if ((this.position.y > 0 && this.position.x > 0) || (this.position.x > 0 && this.position.x < 50)) {
            if (this.angle < (HALF_PI+0.1 + angle_tolerance/2) && this.angle > (HALF_PI+0.1 - angle_tolerance/2)) {
                (this.position.x < 50 && this.position.y < 0) ? this.moveLogic("heavy") : this.moveLogic("light");
            }
            else {
                this.rotateLogic(HALF_PI+0.1);
            }
        }
        else if ((this.position.y > 0 && this.position.x < 0) || (this.position.x < 0 && this.position.x > -50)) {
            if (this.angle < (HALF_PI-0.1 + angle_tolerance/2) && this.angle > (HALF_PI-0.1 - angle_tolerance/2)) {
                (this.position.x > -50 && this.position.y < 0) ? this.moveLogic("heavy") : this.moveLogic("light");
            }
            else {
                this.rotateLogic(HALF_PI-0.1);
            }
        }
        else if (this.position.y < 0 && this.position.x < 0) {
            if (this.angle < (HALF_PI-0.5 + angle_tolerance/2) && this.angle > ((HALF_PI-0.5 - angle_tolerance/2))) {
                this.moveLogic("heavy");
            }
            else {
                this.rotateLogic(HALF_PI-0.5);
            }
        }
        else if (this.position.y < 0 && this.position.x > 0) {
            if (this.angle < (HALF_PI+0.5 + angle_tolerance/2) && this.angle > ((HALF_PI+0.5 - angle_tolerance/2))) {
                this.moveLogic("heavy");
            }
            else {
                this.rotateLogic(HALF_PI+0.5);
            }
        }
        //motors into forces
        this.velocity.add(p5.Vector.mult(createVector((this.motor1 + this.motor2)*cos(this.angle), (this.motor1 + this.motor2)*sin(this.angle)), motorStrength * deltaTime/1000));
        this.angularVelocity += (this.motor2 - this.motor1) * rotCoeff * motorStrength * deltaTime/1000;
        this.applyNaturalForces();
        this.position.add(p5.Vector.mult(this.velocity, deltaTime/1000));
        this.angle += this.angularVelocity * deltaTime/1000;
    }

    rotateLogic(rotateTo) {
        let angleDiff = constrain(rotateTo, QUARTER_PI, 3*QUARTER_PI) - this.angle;
        if (angleDiff > 0) {
            this.motor1 = -0.1;
            this.motor2 = 0.1;
        }
        else if (angleDiff < 0) {
            this.motor1 = 0.1;
            this.motor2 = -0.1;
        }
    }

    moveLogic(mode) {
        if (mode === "light") {
            this.motor1 = 0.1;
            this.motor2 = 0.1;
        }
        else if (mode === "heavy") {
            this.motor1 = 1;
            this.motor2 = 1;
        }
    }

    setForces(x, y) {
        this.natForces.x = x;
        this.natForces.y = y;
    }

    applyNaturalForces() {
        // Gravity
        this.velocity.add(p5.Vector.mult(createVector(0, -100), deltaTime/1000)); //gravity
        this.velocity.add(p5.Vector.mult(this.natForces, deltaTime/1000)); //other forces
        // Linear air drag
        let drag = this.velocity.copy();
        if (drag.mag() > 0) {
            drag.normalize();
            drag.mult(-dragCoeff * this.velocity.magSq());
            this.velocity.add(p5.Vector.mult(drag, deltaTime / 1000));
        }

        // Rotational air drag
        let angularDrag = -dragCoeff * this.angularVelocity * abs(this.angularVelocity);
        this.angularVelocity += angularDrag * deltaTime / 1000;
    }
}


function setup() {
  createCanvas(700, 700);
  drone = new Drone(300, 300, HALF_PI);
  drone.setForces(10, 0);
}

function draw() {
  translate(width / 2, height / 2);
  background(220);
  drone.update();
  drone.display();
}