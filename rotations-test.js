class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.desiredAngle = 0;
    this.angle = 0;
    this.angularSpeed = 0;
    this.rotForce = 0;
  }
  update() {
    this.setRotation()
    this.angularSpeed += this.rotForce * deltaTime/1000;
    this.angle += this.angularSpeed * deltaTime/1000;
  }
  display() {
    push();
    translate(width/2, height/2);
    scale(1, -1);
    rotate(this.angle);
    fill("red");
    rect(this.x - this.w/2, this.y + this.h/2, this.w, -this.h);
    fill("green");
    triangle(-5, -4, 5, -4, 0, 5);
    pop();
  }
  setAngle(angle) {
    this.desiredAngle = angle;
  }
  setRotation() {
    if ((this.angle > this.desiredAngle-0.03) && (this.angle < this.desiredAngle+0.03)) {
        this.rotForce = -50*this.angularSpeed;
  }
    else {
      this.rotForce = (this.desiredAngle - this.angle);
    }
  }
}

function setup() {
  createCanvas(700, 700);
  drone = new Rectangle(0, 0, 200, 20);
  drone.setAngle(HALF_PI);
}

function draw() {
    background(220);
    drone.update();
    drone.display();
}