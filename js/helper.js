/**
 * @fileOverview Collection of helper functions.
 * @author Cynthia Teeters <me@cynthiateeters.com>
 */

/**
 * Configuration values shared between app.js and engine.js
 */
var config = {
    canvasDimensions: {
        canvasWidth: 909,
        canvasHeight: 590,
        canvasRows: 6, // rows should stay at 6 unless changes made to engine.js
        canvasCols: 9
    },
    xDimensions: {
        xInterval: 101,
        xMax: 909
    },
    yDimensions: {
        yInterval: 83,
        yMax: 415
    },
    textStyles: {
        h3: '24pt Calibri',
        colored: "blue",
        h4: '18pt Calibri',
        black: "black",
        white: "#efeeea"
    }
};
var ctx, canvas, scaleVal = 1,
    canvasDiv, windowRect, isRunning = true,
    soundEfx, soundWin, sky, isScoreboardUp = false;
//

function createCanvas() {

    soundEfx = document.getElementById("soundEfx");
    soundEfx.volume = 1.0;
    soundWin = document.getElementById("soundWin");
    soundWin.volume = 0.1;
    sky = 'images/layer_2.png';
    Resources.load(sky);

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');

    canvasDiv = document.getElementById("canvas-here");

    /*
     * Create playarea
     */

    canvas.setAttribute("id", "playarea");
    //canvas.setAttribute("style", "border: 1px solid white");

    //

    // scale canvas to fit device
    scaleCanvas(ctx);
    var lazyResize = _.debounce(scaleCanvas, 300);
    $(window).resize(lazyResize);
    $("body").css("overflow", "hidden");
    //
    ctx.strokeRect(0, 0, config.canvasDimensions.canvasWidth, config.canvasDimensions.canvasHeight);
    ctx.fillStyle = "#566ed7";
    ctx.fillRect(0, 0, config.canvasDimensions.canvasWidth, 0.5 * config.canvasDimensions.canvasHeight);
    ctx.fillStyle = "#3f3f46";
    ctx.fillRect(0, 0.5 * config.canvasDimensions.canvasHeight, config.canvasDimensions.canvasWidth, 0.5 * config.canvasDimensions.canvasHeight);
    ctx.fillStyle = "#eee";
    ctx.fillRect(0, config.canvasDimensions.canvasHeight - 50, 0.25 * config.canvasDimensions.canvasWidth, 10);
    ctx.fillRect(0.25 * config.canvasDimensions.canvasWidth + 20, config.canvasDimensions.canvasHeight - 50, 0.25 * config.canvasDimensions.canvasWidth, 10);
    ctx.fillRect(0.5 * config.canvasDimensions.canvasWidth + 40, config.canvasDimensions.canvasHeight - 50, 0.25 * config.canvasDimensions.canvasWidth, 10);
    ctx.fillRect(0.75 * config.canvasDimensions.canvasWidth + 60, config.canvasDimensions.canvasHeight - 50, 0.25 * config.canvasDimensions.canvasWidth, 10);

    //
    canvas.width = scaleVal * config.canvasDimensions.canvasWidth;
    canvas.height = scaleVal * config.canvasDimensions.canvasHeight;
    //

    canvasDiv.appendChild(canvas);

    //
    ctx.scale(scaleVal, scaleVal);

}
//
//

function scaleCanvas() {
    var scaleX = window.innerWidth / (config.canvasDimensions.canvasWidth * 1.1);
    var scaleY = window.innerHeight / (config.canvasDimensions.canvasHeight * 1.1);
    scaleVal = (scaleX < scaleY) ? scaleX : scaleY;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    canvas.width = scaleVal * config.canvasDimensions.canvasWidth;
    canvas.height = scaleVal * config.canvasDimensions.canvasHeight;
    //
    canvasDiv.appendChild(canvas);
    windowRect = canvas.getBoundingClientRect();
    //
    ctx.scale(scaleVal, scaleVal);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (isScoreboardUp) {
        scoreboard.update(0);
    }

}

function createRandom(min, max) {
    //
    return Math.floor(Math.random() * (max - min + 1) + min);
}
