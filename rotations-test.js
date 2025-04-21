function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES); // Use degrees for easier interpretation
  textAlign(LEFT, BOTTOM);
}

function draw() {
  background(240);

  push();
  translate(mouseX, mouseY);
  scale(1, -1);

  // Vector from mouse to center
  let dx = width / 2 - mouseX;
  let dy = -(height / 2 - mouseY); // Inverted due to flipped y-axis

  push();
  let angle = atan2(dy, dx);

  // Triangle dimensions
  let base = 40;
  let triHeight = 200;

  push();
  rotate(angle); // Rotate the triangle to point at the mouse

  // Draw triangle pointing right at angle 0
  fill(100, 150, 255);
  noStroke();
  beginShape();
  vertex(triHeight, 0);    // Tip of the triangle
  vertex(0, -base / 2);    // Bottom-left
  vertex(0, base / 2);     // Top-left
  endShape(CLOSE);
  pop();
  pop();

  // Draw text in normal (unflipped) space, centered on screen
  pop(); // Restore to unflipped space
  push();
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  text(`Angle: ${angle.toFixed(2)}°`, width / 2, height / 2);
  pop();
}
