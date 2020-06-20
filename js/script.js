import Flock from "./flock.js";

// Initial setup
const canvas = document.querySelector('#flock');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');

// Controller initialization
const number = document.querySelector('span.number');

// Sliders
const units = document.getElementById('units');

const separation = document.getElementById('separation');
const alignment = document.getElementById('alignment');
const cohesion = document.getElementById('cohesion');

const viewRadius = document.getElementById('view-radius');
const avoidMultiplier = document.getElementById('avoid-radius');

// START script
let flock = new Flock();
function animate() {
    flock.draw(ctx);
    requestAnimationFrame(animate);
}

animate();

// Sliders initialization
units['value'] = flock.units;
number.textContent = '' + flock.boids.length;
separation['value'] = flock.separationFactor;
alignment['value'] = flock.alignmentFactor;
cohesion['value'] = flock.cohesionFactor;
viewRadius['value'] = flock.neighborRadius;
avoidMultiplier['value'] = flock.avoidRadiusFactor;

// Controller
units.addEventListener('input', ev => {
    flock.units = ev.target['value'];

    while (flock.boids.length < flock.units) {
        flock.addBoid(Math.random() * innerWidth, Math.random() * innerHeight);
    }

    while (flock.boids.length > flock.units) {
        flock.boids.pop();
    }

    number.textContent = "" + flock.units;
})

separation.addEventListener('input', ev => {
    flock.separationFactor = +ev.target['value'];
});

alignment.addEventListener('input', ev => {
    flock.alignmentFactor = +ev.target['value'];
});

cohesion.addEventListener('input', ev => {
    flock.cohesionFactor = +ev.target['value'];
});

viewRadius.addEventListener('input', ev => {
    flock.neighborRadius = +ev.target['value'];
});

avoidMultiplier.addEventListener('input', ev => {
    flock.avoidRadiusFactor = +ev.target['value'];
})

// Resize window
window.addEventListener('resize', ev => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
