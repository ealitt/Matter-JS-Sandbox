var Physics = Physics || {};

let color = '#ffffff';

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

    let ballSize = 15,
    ballRow = 50,
    ballCol = 50;

    let bouncy = 0.4;

    let engine = Engine.create({
        enableSleeping: true
    }),
    world = engine.world;

    let pageHeight = document.body.clientHeight*2,
    pageWidth = document.body.clientWidth*2;

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

    // let balls = Composites.pyramid(centerX+(-5 + Math.random())-(ballCol*ballSize),100+(-5 + Math.random()), ballCol, ballRow,0,0, (x,y) =>{
    //     let ball = Bodies.circle(x,y,ballSize, {
    //         render: {
    //             fillStyle: color,
    //             strokeStyle: 'C'
    //         },
    //         friction: 0.00004,
    //         frictionAir: 0.001,
    //         density: 0.01,
    //         restitution: 0.4,
    //         sleepThreshold: 25
    //     })
    //     Matter.Events.on(ball, "sleepStart", () => {
    //         Matter.Body.setStatic(ball, true);
    //     });
    //     return ball;
    // });

    // Composite.rotate(balls, Math.PI, Vector.create(centerX, 50));

    let numBalls = 1000;
    setInterval(() => {
        if(numBalls-- > 0){
            let ball = Bodies.circle(centerX+(-0.5 + Math.random()),0,ballSize, {
                render: {
                    // fillStyle: color,
                    strokeStyle: 'C'
                },
                friction: 0.00001,
                frictionAir: 0.001,
                density: 0.01,
                restitution: 0.4,
                sleepThreshold: 25
            });
            Matter.Events.on(ball, "sleepStart", () => {
                Matter.Body.setStatic(ball, true);
            });
            World.add(engine.world, ball);
        }
    }, 50);

    let floor = Bodies.rectangle(centerX,centerY*2,pageWidth,40, {
        render: {
            fillStyle: color,
            strokeStyle: 'C'
        },
        isStatic: true
    })

    let walls = [createWall(Bodies,pageHeight,0,centerY), createWall(Bodies,pageHeight,pageWidth,centerY)];

    // World.add(engine.world, balls);
    World.add(engine.world, floor);
    World.add(engine.world, walls);


    let keys = [];
    document.body.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
    });

    Events.on(engine, 'afterUpdate', function() {
        if(keys[67]){
            bouncy = bouncy + 0.1;
        }
        if(keys[86]){
            bouncy = bouncy - 0.1;
        }
        if (keys[32]){
            ball = Bodies.circle(mouseConstraint.mouse.position.x, mouseConstraint.mouse.position.y, ballSize, {
                render: {
                    fillStyle: color,
                    strokeStyle: '#ffffff',
                    lineWidth: 3
                },
                // isStatic: false,
                friction: 0.00005,
                restitution: 0.5,
                // sleepThreshold: 80
            });
            // Matter.Events.on(ball, "sleepStart", () => {
            //     Matter.Body.setStatic(ball, true);
            // });

            World.add(engine.world, ball);
            }
    });

    let pegs = [];
    let pegSize = 14,
    colSpacing = 145,
    rowSpacing = 70,
    rows = 15;

    for (i = 0; i < rows; i++){
        for(j=0; j <= i; j++){
            pegs.push(
                Bodies.circle(centerX-colSpacing*((i)/2)+colSpacing*j, 200+i*rowSpacing, pegSize, {
                    render: {
                        fillStyle: color,
                        strokeStyle: '#ffffff',
                        lineWidth: 3
                    },
                    isStatic: true
                })
            )
        }
    }
    World.add(world, pegs);

    let dividers = createDividers(Bodies,centerX,pageHeight);
    World.add(world, dividers);

    // add mouse control
    let mouse = Mouse.create(render.canvas),
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
            fillStyle: color,
            strokeStyle: 'C'
        },
        isStatic: true
    })
}

function createDividers(Bodies,centerX,pageHeight){
    let wallHeight = 1200,
    wallWidth = 10,
    num = 30,
    spacing = centerX/num*2,
    dividers = [];

    for(let i = 0; i<num; i++){
        dividers.push(
            Bodies.rectangle(centerX-spacing/2-spacing*i,pageHeight-100,wallWidth,wallHeight, {
                render: {
                    fillStyle: color,
                    strokeStyle: 'C'
                },
                isStatic: true
            })
        );
        dividers.push(
            Bodies.rectangle(centerX+spacing/2+spacing*i,pageHeight-100,wallWidth,wallHeight, {
                render: {
                    fillStyle: color,
                    strokeStyle: 'C'
                },
                isStatic: true
            })
        );
    }
    return dividers;
}


window.onload = function() {
    Physics.sandbox();
}

