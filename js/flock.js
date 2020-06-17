import Boid from './boid.js'

// Initial setup
const canvas = document.querySelector('#flock');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const separation = document.getElementById('separation');
const alignment = document.getElementById('alignment');
const cohesion = document.getElementById('cohesion');

const ctx = canvas.getContext('2d');

// Initial the flock
let boids = [];
let limit = 100;
for (let i = 0; i < 200; i++) {
    const randomX = Math.random() * (canvas.width - 20) + 10;
    const randomY = Math.random() * (canvas.height - 20) + 10
    boids.push(new Boid(randomX, randomY));
}

//// Animate loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let boid of boids) {
        boid.handleEdges();
        boid.follow(boids, limit);
        boid.draw(ctx);
        boid.update();
        if (isNaN(boid.position.x)) console.log('error');
    }
}

animate()

separation.addEventListener('input', ev => {
    boids.forEach(boid => boid.separateFactor = +ev.target['value']);
})

alignment.addEventListener('input', ev => {
    boids.forEach(boid => boid.alignmentFactor = +ev.target['value']);
})

cohesion.addEventListener('input', ev => {
    boids.forEach(boid => boid.cohesionFactor = +ev.target['value']);
})
