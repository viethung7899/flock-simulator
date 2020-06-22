export default class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contain(boid) {
        let point = boid.position;
        return (this.x <= point.x && point.x <= this.x + this.width
            && this.y <= point.y && point.y <= this.y + this.height);
    }

    show(context2D, color = 'white') {
        context2D.beginPath();
        context2D.rect(this.x, this.y, this.width, this.height);
        context2D.strokeStyle = color;
        context2D.stroke();
    }
}
