export default class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    random(magnitude = 1) {
        const angle = Math.random() * Math.PI * 2;
        this.x = magnitude * Math.cos(angle);
        this.y = magnitude * Math.sin(angle)
    }

    // Add vectors
    add(x, y) {
        this.x += x;
        this.y += y;
    }

    addVector(other) {
        this.add(other.x, other.y);
    }

    // Subtract vector
    subtract(x, y) {
        this.add(-x, -y);
    }

    subtractVector(other) {
        this.add(-other.x, -other.y);
    }

    // Scalar multiplication
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    divide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    getMag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    getAngle() {
        return Math.atan2(this.y, this.x);
    }

    getDist(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2)
            + Math.pow(this.y - other.y, 2));
    }

    setMag(magnitude) {
        this.divide(this.getMag());
        this.multiply(magnitude);
    }

    static addVectors(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }

    static subtractVectors(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static multiplyVectors(v, scalar) {
        return new Vector(v.x * scalar, v.y * scalar);
    }
}
