class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.angle = 0;
    this.angularSpeed = 0;
    this.rotForce = 0;
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
  rotateTo(angle) {
  desired_force = 1000*this.angularSpeed / deltaTime;
  }
}

function setup() {
  createCanvas(700, 700);
  drone = new Rectangle(0, 0, 200, 20);
}

function draw() {
    background(180);
    drone.display();
}