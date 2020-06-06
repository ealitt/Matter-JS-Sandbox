var Physics = Physics || {};

Physics.sandbox = function() {
    let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector;;

    let ballSize = 5,
    ballRow = 50,
    ballCol = 50;

    let bouncy = 0.1;

    let engine = Engine.create({
        enableSleeping: true
    }),
    world = engine.world;

    let pageHeight = document.body.clientHeight,
    pageWidth = document.body.clientWidth;

    let render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: pageWidth,
            height: pageHeight,
            wireframes: false
        }
    });

    let centerX = pageWidth/2,
    centerY = pageHeight/2;

    Render.run(render);

    // create runner
    let runner = Runner.create();
    Runner.run(runner, engine);

    let balls = Composites.pyramid(centerX+(-5 + Math.random())-(ballCol*ballSize),10+(-5 + Math.random()), ballCol, ballRow,0,0, (x,y) =>{
        return Bodies.circle(x,y,ballSize, {
            render: {
                fillStyle: '#85c226',
                strokeStyle: 'C'
            },
            isStatic: false,
            friction: 0.04,
            frictionAir: 0.01,
            restitution: 2
        });
    });

    Composite.rotate(balls, Math.PI, Vector.create(centerX, 50));

    let floor = Bodies.rectangle(centerX,centerY*2,pageWidth,40, {
        render: {
            fillStyle: '#85c226',
            strokeStyle: 'C'
        },
        isStatic: true
    })

   let walls = [createWall(Bodies,pageHeight,0,centerY), createWall(Bodies,pageHeight,pageWidth,centerY)];

    // World.add(engine.world, balls);
    World.add(engine.world, floor);
    World.add(engine.world, walls);


    var keys = [];
    document.body.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
    });

    Events.on(engine, 'afterUpdate', function() {
        if(keys[67]){
            bouncy = bouncy + 0.1;
            console.log(bouncy);
        }
        if(keys[86]){
            bouncy = bouncy - 0.1;
            console.log(bouncy);
        }
        if (keys[32]){
            ball = Bodies.circle(mouseConstraint.mouse.position.x, mouseConstraint.mouse.position.y, 10, {
                render: {
                    fillStyle: '#85c226',
                    strokeStyle: '#ffffff',
                    lineWidth: 3
                },
                isStatic: false,
                friction: 0.04,
                frictionAir: 0.01,
                restitution: bouncy
            });
            World.add(engine.world, ball);
            }
    });

    let pegs = [];
    let colSpacing = 40,
    rowSpacing = 20,
    rows = 10;

    for (i = 0; i < rows; i++){
        for(j=0; j < i; j++){
            pegs.push(
                Bodies.circle(centerX-j*colSpacing, centerY+i*rowSpacing, 10, {
                    render: {
                        fillStyle: '#85c226',
                        strokeStyle: '#ffffff',
                        lineWidth: 3
                    },
                    isStatic: true,
                    friction: 0.04,
                    frictionAir: 0.01,
                    restitution: 0.1
                })
            )
        }
    }
    World.add(world, pegs);
    
    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: pageWidth, y: pageHeight }
    });
}

function createWall(Bodies,pageHeight,x,y){
    return Bodies.rectangle(x,y,40,pageHeight, {
        render: {
            fillStyle: '#85c226',
            strokeStyle: 'C'
        },
        isStatic: true
    })
}

window.onload = function() {
    Physics.sandbox();
}
