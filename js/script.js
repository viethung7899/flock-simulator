import Flock from "./flock.js";

// Initial setup
const canvas = document.querySelector('#flock');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');

// Controller initialization
const number = document.querySelector('span.number');

// Sliders
const separation = document.getElementById('separation');
const alignment = document.getElementById('alignment');
const cohesion = document.getElementById('cohesion');
const viewRadius = document.getElementById('view-radius');

// Button
const resetButton = document.querySelector('button');

// START script
let flock = new Flock();
function animate() {
    flock.draw(ctx);
    requestAnimationFrame(animate);
}

animate();

// Sliders INIT
number.textContent = '' + flock.boids.length;
separation['value'] = flock.separationFactor;
alignment['value'] = flock.alignmentFactor;
cohesion['value'] = flock.cohesionFactor;
viewRadius['value'] = flock.neighborRadius;

// Add boid by hover the screen
document.addEventListener('mousemove', ev => {
    if (ev.target === canvas) {
        flock.addBoid(ev.clientX, ev.clientY);
        number.textContent = "" + flock.boids.length;
    }
})

// Reset button
resetButton.addEventListener('click', ev => {
    flock.reset();
    number.textContent = "" + flock.boids.length;
})

// Controller
separation.addEventListener('input', ev => {
    flock.separationFactor = +ev.target['value'];
})

alignment.addEventListener('input', ev => {
    flock.alignmentFactor = +ev.target['value'];
})

cohesion.addEventListener('input', ev => {
    flock.cohesionFactor = +ev.target['value'];
})

viewRadius.addEventListener('input', ev => {
    flock.neighborRadius = +ev.target['value'];
})

// Resize window
window.addEventListener('resize', ev => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
