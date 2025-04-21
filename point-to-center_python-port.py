import math
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# Drone class (same logic as before)
class Drone:
    def __init__(self, x, y, angle):
        self.position = [x, y]
        self.velocity = [0, 0]
        self.angle = angle
        self.angularVelocity = 0
        self.motor1 = 0
        self.motor2 = 0
        self.natForceX = 0
        self.natForceY = 0

        self.angle_tolerance = 0.2
        self.motorStrength = 500
        self.rotCoeff = 0.8
        self.dragCoeff = 0.2

    def update(self, dt):
        toCenter = [-self.position[0], -self.position[1]]
        targetAngle = math.atan2(toCenter[1], toCenter[0])
        angleDiff = math.atan2(math.sin(targetAngle - self.angle), math.cos(targetAngle - self.angle))

        if abs(angleDiff) > self.angle_tolerance:
            self.motor1 = -0.1 if angleDiff > 0 else 0.1
            self.motor2 = 0.1 if angleDiff > 0 else -0.1
        else:
            distance = math.sqrt(toCenter[0]**2 + toCenter[1]**2)
            force = max(0, min(1, distance / 100))
            self.motor1 = force
            self.motor2 = force

        forceX = (self.motor1 + self.motor2) * math.cos(self.angle)
        forceY = (self.motor1 + self.motor2) * math.sin(self.angle)

        self.velocity[0] += forceX * self.motorStrength * dt
        self.velocity[1] += forceY * self.motorStrength * dt
        self.angularVelocity += (self.motor2 - self.motor1) * self.rotCoeff * self.motorStrength * dt

        self.applyNaturalForces(dt)

        self.position[0] += self.velocity[0] * dt
        self.position[1] += self.velocity[1] * dt
        self.angle += self.angularVelocity * dt

    def applyNaturalForces(self, dt):
        self.velocity[1] += -100 * dt
        self.velocity[0] += self.natForceX * dt
        self.velocity[1] += self.natForceY * dt

        dragMag = math.sqrt(self.velocity[0]**2 + self.velocity[1]**2)
        if dragMag > 0:
            dragX = -self.dragCoeff * self.velocity[0] * dragMag
            dragY = -self.dragCoeff * self.velocity[1] * dragMag
            self.velocity[0] += dragX * dt
            self.velocity[1] += dragY * dt

        angularDrag = -self.dragCoeff * self.angularVelocity * abs(self.angularVelocity)
        self.angularVelocity += angularDrag * dt

# --- Visualization ---

drone = Drone(30, 200, math.pi / 2)
dt = 0.01

fig, ax = plt.subplots()
ax.set_aspect('equal')
ax.set_xlim(-400, 400)
ax.set_ylim(-400, 400)
ax.grid(True)

# Draw drone as a triangle using a line collection
drone_body, = ax.plot([], [], 'r-', lw=2)

def init():
    drone_body.set_data([], [])
    return drone_body,

def update(frame):
    drone.update(dt)

    # Define triangle shape in local space
    size = 20
    p1 = (drone.position[0] + size * math.cos(drone.angle),
          drone.position[1] + size * math.sin(drone.angle))
    p2 = (drone.position[0] + size * math.cos(drone.angle + 2.5),
          drone.position[1] + size * math.sin(drone.angle + 2.5))
    p3 = (drone.position[0] + size * math.cos(drone.angle - 2.5),
          drone.position[1] + size * math.sin(drone.angle - 2.5))

    drone_body.set_data([p1[0], p2[0], p3[0], p1[0]],
                        [p1[1], p2[1], p3[1], p1[1]])

    return drone_body,

ani = animation.FuncAnimation(fig, update, frames=1000, init_func=init,
                              interval=10, blit=True)

# --- Add interactive sliders for natForceX and natForceY ---
from matplotlib.widgets import Slider

# Create space for sliders below the plot
plt.subplots_adjust(left=0.1, bottom=0.3)

# Add sliders
ax_force_x = plt.axes([0.1, 0.15, 0.8, 0.03])
ax_force_y = plt.axes([0.1, 0.1, 0.8, 0.03])

slider_force_x = Slider(ax_force_x, 'Force X', -100.0, 100.0, valinit=0)
slider_force_y = Slider(ax_force_y, 'Force Y', -100.0, 100.0, valinit=0)

# Update drone forces when sliders move
def update_force(val):
    drone.natForceX = slider_force_x.val
    drone.natForceY = slider_force_y.val

slider_force_x.on_changed(update_force)
slider_force_y.on_changed(update_force)

plt.show()