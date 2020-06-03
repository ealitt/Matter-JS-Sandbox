// module aliases
let Engine = Matter.Engine,
World = Matter.World,
Bodies = Matter.Bodies;
// Mouse = Matter.Mouse,
// MouseConstraint = Matter.MouseConstraint;

let engine;
let world;
let boxes = [];

function setup() {
    createCanvas(1000, 1000);
    engine = Engine.create();
    world = engine.world;
    Engine.run(engine);

    ground = Bodies.rectangle(500, height, width, 100, {isStatic:true})
    World.add(world, ground);
}

function mouseDragged() {
    boxes.push(new Box(mouseX,mouseY, 100, 100));
}

function mousePressed() {
    boxes.push(new Box(mouseX,mouseY, 100, 100));
}

function draw() {
    background(0);
    boxes.forEach(item => {
        item.show();
    })
}