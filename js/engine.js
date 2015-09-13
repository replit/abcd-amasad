/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function (global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        lastTime;
    createCanvas();

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        //ctx.fillStyle = "#4e4e4e";
        //ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        if (isRunning) {
            update(dt);
            render();
        }

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        scoreboard.update(0);

        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block4.png', // Top row is water
                'images/grass-block3.png', // Row 1 of 2 of grass
                'images/grass-block4.png', // Row 2 of 2 of grass
                'images/grass-block4.png', // Row 1 of 3 of grass
                'images/grass-block4.png', // Row 2 of 3 of grass
                'images/stone-block2.png' // Row 3 of 3 of stone
            ],
            numRows = config.canvasDimensions.canvasRows,
            numCols = config.canvasDimensions.canvasCols,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * config.xDimensions.xInterval, row * config.yDimensions.yInterval);
            }
        }
        ctx.drawImage(Resources.get('images/flowers.png'), 0, 0);
        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });

        player.render();

    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block2.png',
        'images/water-block4.png',
        'images/grass-block2.png',
        'images/grass-block3.png',
        'images/grass-block4.png',
        'images/grass-block5.png',
        'images/flowers.png'
    ]);
    Resources.onReady(init);

    /*
     * *  Start touch control
     */

    var myArea = doc.getElementById("playarea");

    var mc = new Hammer(myArea);
    mc.on("tap", function (ev) {
        var move;
        // Find out where this canvas is on the page
        // See comments http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
        var tapX = (ev.center.x - windowRect.left) / scaleVal;
        var tapY = ((ev.center.y - windowRect.top) / scaleVal) - 50;
        var playerPos = player.report();
        //
        var deltaX = Math.abs(Math.floor((tapX - playerPos.xPos) / config.xDimensions.xInterval));
        var deltaY = Math.abs(Math.floor((tapY - playerPos.yPos) / config.yDimensions.yInterval));
        //
        if ((deltaX + deltaY) === 1) {
            if (deltaX === 1) {
                if (tapX > playerPos.xPos) {
                    move = 'right';
                } else {
                    move = 'left';
                }
            } else {
                if (tapY < playerPos.yPos) {
                    move = 'up';
                } else {
                    move = 'down';
                }
            }
            player.handleInput(move);
        }
    });
})(this);
