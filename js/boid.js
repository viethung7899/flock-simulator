import Vector from "./vector.js";

export default class Boid {
    constructor(x, y) {
        this.position = new Vector(x, y);
        this.velocity = new Vector();
        this.velocity.random(Math.random() * 10 - 5);
        this.acceralation = new Vector();


        // Parameters
        this.radius = 2;

        // Motion parameters
        this.maxSpeed = 5;
        this.maxForce = 0.025;

        // Force factor
        this.separateFactor = 2;
        this.alignmentFactor = 1;
        this.cohesionFactor = 2;
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
        ctx.lineTo( -10, -4);
        ctx.lineTo(-10, 4);
        ctx.lineTo(0, 0);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.fillStyle = '#fff'
        ctx.fill();

        // Reset matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // Update the position
    update() {
        this.velocity.addVector(this.acceralation);
        this.position.addVector(this.velocity);
        this.acceralation.multiply(0);
    }

    // Handle edge cases by re-appear the boid at the opposite edge
    handleEdges() {
        let {position, radius} = this;
        if (position.x < -radius) position.x = innerWidth + radius;
        if (position.y < -radius) position.y = innerHeight + radius;
        if (position.x > innerWidth + radius) position.x = -radius;
        if (position.y > innerHeight + radius) position.y = -radius;

    }

    // Find the local
    findLocal(boids, limit) {
        let local = [];
        let origin = this.position;
        for (let boid of boids) {
            let end = boid.position;
            const dist = origin.getDist(end);
            if (dist < limit && boid !== this) {
                local.push(boid);
            }
        }
        return local;
    }

    // Follow the flock
    follow(boids, limit) {
        const local = this.findLocal(boids, limit);

        let separateForce = this.separate(local);
        let alignForce = this.align(local);
        let cohereForce = this.cohere(local);

        separateForce.multiply(this.separateFactor);
        alignForce.multiply(this.alignmentFactor);
        cohereForce.multiply(this.cohesionFactor)

        this.acceralation.addVector(separateForce);
        this.acceralation.addVector(alignForce);
        this.acceralation.addVector(cohereForce);
    }

    // Rule 1: Separation
    // The boid steers to avoid collision with its flock-mates
    separate(local) {
        let totalDiff = new Vector();
        for (let other of local) {
            let diff = Vector.subtractVectors(this.position, other.position);
            // Weight by distance
            diff.divide(diff.getMag() * diff.getMag());
            totalDiff.addVector(diff);
        }

        if (local.length > 0) {
            totalDiff.divide(local.length);
            totalDiff.setMag(this.maxSpeed);
            let steer = Vector.subtractVectors(totalDiff, this.velocity);
            if (steer.getMag() > this.maxForce)
                steer.setMag(this.maxForce);
            return steer;
        } else return new Vector();
    }

    // Rule 2: Alignment
    // The boid steers to align with the average direction of local
    align(local) {
        let totalDX = 0, totalDY = 0;
        // Find the local average velocity
        for (let boid of local) {
            totalDX += boid.velocity.x;
            totalDY += boid.velocity.y;
        }

        if (local.length > 0) {
            // Calculate desired vector
            let desired = new Vector(totalDX / local.length, totalDY / local.length);
            desired.setMag(this.maxSpeed);
            let steer = Vector.subtractVectors(desired, this.velocity);
            if (steer.getMag() > this.maxForce) steer.setMag(this.maxForce);
            return steer;

        } else return new Vector();
    }

    // Rule 3: Cohesion
    // The boid steers towards the average position of local
    cohere(local) {
        let totalX = 0, totalY = 0;
        // Find the local average velocity
        for (let boid of local) {
            totalX += boid.position.x;
            totalY += boid.position.y;
        }

        if (local.length > 0) {
            // Calculate desired vector
            let desired = new Vector(totalX / local.length, totalY / local.length);
            desired.subtractVector(this.position);
            desired.setMag(this.maxSpeed);
            let steer = Vector.subtractVectors(desired, this.velocity);
            if (steer.getMag() > this.maxForce) steer.setMag(this.maxForce);
            return steer;
        } else return new Vector();

    }
}
