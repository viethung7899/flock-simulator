# Flock simulator

## About
A simulator to demonstrate the flock behaviour in the nature by using Boid algorithm.
Language used: Vanilla JavaScript (no external packages included).

[Link to view the project](https://viethung7899.github.io/flock-simulator/)

## What makes a flock?
Each object in the flock obeys three rules. 
A flock behavior will emerge from the behavior of each object.

### 1. Separation
Each boid in the flock tries to avoid their local flock-mates
to avoid over-crowding. If the boid is too close to another one,
it tries to steer away from it.

### 2. Alignment
Each boid in the flock tries to align with others, 
which means it tries to steer to align with the average velocity of its local.

### 3. Cohesion
Each boid in the flock tries to fly toward others, 
which means it tries to steer towards the average position of its local.
