import Flock from "./flock.js";
import Rectangle from "./geometry/rectangle.js";
import QuadTree from "./quadtree.js";
import Circle from "./geometry/circle.js";

// Initial setup
const canvas = document.querySelector('#flock');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');

// Controller initialization
const number = document.querySelector('span.number');

// Sliders
const units = document.getElementById('units');

// Motion controllers
const separation = document.getElementById('separation');
const alignment = document.getElementById('alignment');
const cohesion = document.getElementById('cohesion');
const viewRadius = document.getElementById('view-radius');
const avoidMultiplier = document.getElementById('avoid-radius');

// Quadtree controllers
const quadtreeCheckBox = document.getElementById('show-quadtree');
const quadtreeCapacity = document.getElementById('quadtree-capacity');

// New flock
let flock = new Flock();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flock.draw(ctx);
    for (let unit of flock.boids) {
        unit.draw(ctx);
    }
    requestAnimationFrame(animate);
}

animate();

units['value'] = flock.units;

// Motion sliders initialization
number.textContent = '' + flock.boids.length;
separation['value'] = flock.separationFactor;
alignment['value'] = flock.alignmentFactor;
cohesion['value'] = flock.cohesionFactor;
viewRadius['value'] = flock.neighborRadius;
avoidMultiplier['value'] = flock.avoidRadiusFactor;

// Quadtree sliders initialization
quadtreeCheckBox['checked'] = flock.displayQuadTree;
quadtreeCapacity['value'] = flock.quadtreeCapacity;



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

// Add event handlers for motion
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

// Add event handlers for quadtree
quadtreeCheckBox.addEventListener('click', ev => {
    flock.displayQuadTree = ev.target['checked'];
})

quadtreeCapacity.addEventListener('input', ev => {
    flock.quadtreeCapacity = +ev.target['value'];
})

// Resize window
window.addEventListener('resize', ev => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
