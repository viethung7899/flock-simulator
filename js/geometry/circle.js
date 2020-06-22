import Vector from "./vector.js";

export default class Circle {
    constructor(x, y, radius) {
        this.center = new Vector(x, y);
        this.radius = radius;
    }

    contain(boid) {
        return this.center.getDist(boid.position) <= this.radius;
    }

    overlap(rectangle) {
        // Find closet point on the rectangle to the circle
        let closetX = this.center.x;
        let closetY = this.center.y;

        if (this.center.x < rectangle.x) closetX = rectangle.x;
        else if (this.center.x > rectangle.x + rectangle.width) closetX = rectangle.x + rectangle.width;

        if (this.center.y < rectangle.y) closetY = rectangle.y;
        else if (this.center.y > rectangle.y + rectangle.height) closetY = rectangle.y + rectangle.height;

        let test = new Vector(this.center.x - closetX, this.center.y - closetY);

        return test.getMag() <= this.radius;
    }

    show(ctx, color = 'green') {
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }

}
