import Vector from "./vector.js";


let print = 0;
const deltaTime = 0.5;

export default class Boid {
    constructor(x, y) {
        this.radius = 10;
        this.position = new Vector(x, y);
        this.velocity = new Vector();
        this.velocity.random(Math.random() * 10 - 5);
        this.acceleration = new Vector();
    }

    // Draw on canvas
    draw(ctx) {
        let {position, velocity} = this;
        const angle = velocity.getAngle();

        // Transform matrix
        ctx.translate(position.x, position.y);
        ctx.rotate(angle);

        // Draw boid
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo( -6, -2);
        ctx.lineTo(-6, 2);
        ctx.lineTo(0, 0);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.fill();

        // Reset matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // Update the position
    update() {
        this.velocity.addVector(Vector.multiplyVectors(this.acceleration, deltaTime));
        this.position.addVector(Vector.multiplyVectors(this.velocity, deltaTime));
        this.acceleration.multiply(0);
        this.handleEdges();
    }

    // Handle the edge
    handleEdges() {
        let {position, radius} = this;
        if (position.x < -radius) position.x = innerWidth + radius;
        if (position.y < -radius) position.y = innerHeight + radius;
        if (position.x > innerWidth + radius) position.x = -radius;
        if (position.y > innerHeight + radius) position.y = -radius;

    }

    // Rule 1: Separation
    separation(local, avoidRadius) {
        let move = new Vector();
        if (local.length === 0) return move;

        let avoidCount = 0;
        for (let other of local) {
            if (other.position.getDist(this.position) < avoidRadius) {
                let diff = Vector.subtractVectors(this.position, other.position);
                diff.divide(diff.getMag() * diff.getMag());
                move.addVector(diff);
                avoidCount++;
            }
        }

        if (avoidCount > 0) move.divide(avoidCount);
        return move;
    }

    // Rule 2: Alignment
    alignment(local) {
        if (local.length === 0)
            return this.velocity;

        let move = new Vector();
        for (let other of local) {
            move.addVector(other.velocity);
        }
        move.divide(local.length);
        return move;
    }

    // Rule 3: Cohesion
    cohesion(local) {
        let move = new Vector();
        if (local.length === 0) return move;

        for (let other of local) {
            move.addVector(other.position);
        }
        move.divide(local.length);
        move.subtractVector(this.position);

        return move;
    }

    applyForce(force) {
        this.acceleration.addVector(force);
    }
}
