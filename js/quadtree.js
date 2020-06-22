import Rectangle from "./geometry/rectangle.js";

export default class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.boids = [];

        this.northwest = undefined;
        this.northeast = undefined;
        this.southwest = undefined;
        this.southeast = undefined;

        // Display
        this.canDisplay = true;
    }

    insert(boid) {
        if (!this.boundary.contain(boid)) return false;

        if (this.boids.length < this.capacity && this.northwest === undefined) {
            this.boids.push(boid);
            return true;
        }

        if (this.northeast === undefined) this.subdivide();

        if (this.northwest.insert(boid)) return true;
        if (this.northeast.insert(boid)) return true;
        if (this.southwest.insert(boid)) return true;
        return this.southeast.insert(boid);
    }

    subdivide() {
        let {x, y, width, height} = this.boundary;

        let nw = new Rectangle(x, y, width/2, height/2);
        let ne = new Rectangle(x + width/2, y, width/2, height/2);
        let sw = new Rectangle(x, y + height/2, width/2, height/2);
        let se = new Rectangle(x + width/2, y + height/2, width/2, height/2);

        this.northwest = new QuadTree(nw, this.capacity);
        this.northeast = new QuadTree(ne, this.capacity);
        this.southwest = new QuadTree(sw, this.capacity);
        this.southeast = new QuadTree(se, this.capacity);
    }

    getPointsInCircle(circleBound) {
        let found = [];
        if (!circleBound.overlap(this.boundary)) return found;

        for (let boid of this.boids) {
            if (circleBound.contain(boid)) found.push(boid);
        }

        if (this.northwest === undefined)
            return found;

        let foundNW = this.northwest.getPointsInCircle(circleBound);
        let foundNE = this.northeast.getPointsInCircle(circleBound);
        let foundSW = this.southwest.getPointsInCircle(circleBound);
        let foundSE = this.southeast.getPointsInCircle(circleBound);

        return found.concat(foundNW, foundNE, foundSW, foundSE);
    }

    show(ctx) {
        this.boundary.show(ctx, 'green');

        if (this.northwest !== undefined) {
            this.northwest.show(ctx);
            this.northeast.show(ctx);
            this.southwest.show(ctx);
            this.southeast.show(ctx);
        }
    }
}
