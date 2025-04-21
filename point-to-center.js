angle_tolerance = 0.2;
motorStrength = 500;
rotCoeff = 0.8;
dragCoeff = 0.2;
class Drone {
  constructor(x, y, angle) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.angle = angle; //half pi is straight up
    this.angularVelocity = 0;
    this.motor1 = 0;
    this.motor2 = 0;
    this.natForceX = createSlider(-50, 50, 0);
    this.natForceY = createSlider(-50, 50, 0);
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
      // Step 1: Rotate to face the center
      let toCenter = p5.Vector.sub(createVector(0, 0), this.position);
      let targetAngle = atan2(toCenter.y, toCenter.x);
      let angleDiff = targetAngle - this.angle;
      angleDiff = atan2(sin(angleDiff), cos(angleDiff)); // Normalize between -PI and PI

      if (abs(angleDiff) > angle_tolerance) {
        this.motor1 = angleDiff > 0 ? -0.1 : 0.1;
        this.motor2 = angleDiff > 0 ? 0.1 : -0.1;
      } else {
        // Step 2: Move towards center with force proportional to distance
        let distance = toCenter.mag();
        let force = constrain(distance / 100, 0, 1); // Scale and cap the force
        this.motor1 = force;
        this.motor2 = force;
      }

      // Apply motor-based forces
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

    applyNaturalForces() {
        // Gravity
        this.velocity.add(p5.Vector.mult(createVector(0, -100), deltaTime/1000)); //gravity
        this.velocity.add(p5.Vector.mult(createVector(this.natForceX.value(), this.natForceY.value()), deltaTime/1000)); //other forces
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

function mouseClicked() {
  drone.position.x = mouseX - width/2;
  drone.position.y = -mouseY + height/2;
}


function keyPressed() {
    let step = 10;
  
    if (keyCode === LEFT_ARROW) {
      drone.natForceX.value(drone.natForceX.value() - step);
    } else if (keyCode === RIGHT_ARROW) {
      drone.natForceX.value(drone.natForceX.value() + step);
    } else if (keyCode === UP_ARROW) {
      drone.natForceY.value(drone.natForceY.value() + step); // Positive Y
    } else if (keyCode === DOWN_ARROW) {
      drone.natForceY.value(drone.natForceY.value() - step); // Negative Y
    }
  }

function setup() {
  createCanvas(700, 700);
  drone = new Drone(30, 200, HALF_PI);
}

function draw() {
  translate(width / 2, height / 2);
  background(220);
  drone.update();
  drone.display();
}