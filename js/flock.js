import Boid from './boid.js';
import Vector from './geometry/vector.js';
import QuadTree from "./quadtree.js";
import Rectangle from "./geometry/rectangle.js";
import Circle from "./geometry/circle.js";

const LIMIT = 300;

export default class Flock {
    constructor() {
        this.boids = [];
        this.units = 100;

        // Parameters can change in controller
        this.separationFactor = 2;
        this.alignmentFactor = 1;
        this.cohesionFactor = 1;
        this.maxForce = 0.025;
        this.maxSpeed = 4;
        this.neighborRadius = 50;
        this.avoidRadiusFactor = 0.5;

        this.quadtree = undefined;
        this.quadtreeCapacity = 10;
        this.displayQuadTree = false;

        for (let i = 0; i < this.units; i++) {
            this.addBoid(Math.random() * innerWidth, Math.random() * innerHeight);
        }
    }

    addBoid(x, y) {
        this.boids.push(new Boid(x, y));
    }


    draw(ctx) {
        this.quadtree = new QuadTree(new Rectangle(0, 0, innerWidth, innerHeight), this.quadtreeCapacity);

        for (let boid of this.boids) {
            this.quadtree.insert(boid);
            boid.draw(ctx);
            this.drive(boid);
            boid.update();
        }

        if (this.displayQuadTree) this.quadtree.show(ctx);
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
        // Naive method (slow)
        // let local = [];
        // for (let other of this.boids) {
        //     if (other !== boid && other.position.getDist(boid.position) < this.neighborRadius) {
        //         local.push(other);
        //     }
        // }
        // return local;

        // Quadtree method (faster)
        let boundary = new Circle(boid.position.x, boid.position.y, this.neighborRadius);
        let found = this.quadtree.getPointsInCircle(boundary);
        return found.filter(unit => unit !== boid);
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
