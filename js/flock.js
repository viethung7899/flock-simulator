import Boid from './boid.js';
import Vector from './vector.js';

const LIMIT = 300;

export default class Flock {
    constructor() {
        this.boids = [];

        // Parameters can change in controller
        this.separationFactor = 2;
        this.alignmentFactor = 1;
        this.cohesionFactor = 1;
        this.maxForce = 0.025;
        this.maxSpeed = 4;
        this.neighborRadius = 50;
        this.avoidRadiusFactor = 0.5;
    }

    addBoid(x, y) {
        if (this.boids.length < LIMIT)
            this.boids.push(new Boid(x, y));
    }

    reset() {
        this.boids = [];
    }

    draw(ctx) {
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let boid of this.boids) {
            boid.draw(ctx);
            this.drive(boid);
            boid.update();
        }
    }

    drive(boid) {
        // Find local
        let local = this.findLocal(boid);

        // Find desired direction
        let separationDrive = boid.separation(local, this.neighborRadius * this.avoidRadiusFactor);
        let alignmentDrive = boid.alignment(local);
        let cohesionDrive = boid.cohesion(local);

        // Generate forces
        let separationForce = generateForce(boid, separationDrive, this.maxSpeed, this.maxForce);
        let alignmentForce = generateForce(boid, alignmentDrive, this.maxSpeed, this.maxForce);
        let cohesionForce = generateForce(boid, cohesionDrive, this.maxSpeed, this.maxForce);

        // Apply weight
        separationForce.multiply(this.separationFactor);
        alignmentForce.multiply(this.alignmentFactor);
        cohesionForce.multiply(this.cohesionFactor);


        // Apply force
        boid.applyForce(separationForce);
        boid.applyForce(alignmentForce);
        boid.applyForce(cohesionForce);
    }

    findLocal(boid) {
        let local = [];
        for (let other of this.boids) {
            // console.log(other.position.getDist(boid.position));
            if (other !== boid && other.position.getDist(boid.position) < this.neighborRadius) {
                local.push(other);
            }
        }
        return local;
    }
}

function generateForce(boid, drive, maxSpeed, maxForce) {
    if (drive.getMag() === 0) return new Vector();

    let steer = Vector.multiplyVectors(drive, 1);
    steer.setMag(maxSpeed);

    steer.subtractVector(boid.velocity);
    if (steer.getMag() > maxForce) steer.setMag(maxForce);

    return steer;
}
