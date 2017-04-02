'use strict'

var WIDTH = $(document).width();    // 整个文件流的宽度
var HEIGHT = $(document).height();  // 整个文件流的高度
var POINTS = 35;        // 定义需要绘制的点的个数

var canvas = $('#Mycanvas').get(0);
canvas.width = WIDTH;
canvas.height = HEIGHT;
var context = canvas.getContext('2d');
context.strokeStyle = 'rgba(0,0,0,.02)';
context.strokeWidth = 1;
context.fillStyle = 'rgba(0,0,0,.05)';
var circleArr = [];

// 线条类：开始xy坐标，结束xy坐标
function Line(beginX, beginY, endX, endY) {
    this.beginX = beginX;
    this.beginY = beginY;
    this.endX = endX;
    this.endY = endY;
}

// 圆点类：圆心xy坐标，半径，每帧移动xy的距离
function Circle(centreX, centreY, r, translateX, translateY) {
    this.centreX = centreX;
    this.centreY = centreY;
    this.r = r;
    this.translateX = translateX;
    this.translateY = translateY;
}

// 随机数生成器，生成max和min之间的随机数，_min 表示可选参数
function RNG(max, _min) {
    let min = _min || 0;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// 绘制圆点
function drawCricle(cxt, circle) {
    cxt.beginPath();
    cxt.arc(circle.centreX, circle.centreY, circle.r, 0, 2 * Math.PI);
    cxt.closePath();
    cxt.fill();
}

//绘制线条
function drawLine(cxt, line, opacity) {
    cxt.beginPath();
    cxt.strokeStyle = 'rgba(0,0,0,' + opacity + ')';
    cxt.moveTo(line.beginX, line.beginY);
    cxt.lineTo(line.endX, line.endY);
    cxt.closePath();
    cxt.stroke();
}

//初始化生成原点
function init() {
    circleArr = [];
    for (let i = 0; i < POINTS; i++) {
        let circle = new Circle(RNG(WIDTH), RNG(HEIGHT), RNG(15, 2),
            RNG(10, -10) / 35, RNG(10, -10) / 35);
        circleArr.push(circle);
        drawCricle(context, circle);
    }
    draw();
}

//每帧绘制
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < POINTS; i++) {
        drawCricle(context, circleArr[i]);
    }
    for (let i = 0; i < POINTS; i++) {
        for (let j = 0; j < POINTS; j++) {
            if (i + j < POINTS) {
                let circle1 = circleArr[i + j];
                let circle2 = circleArr[i];
                let diffx = Math.abs(circle1.centreX - circle2.centreX);
                let diffy = Math.abs(circle1.centreY - circle2.centreY);
                let lineLength = Math.sqrt(diffx * diffx + diffy * diffy);
                let opacity = 1 / lineLength * 7 - 0.009;
                let lineOpacity = opacity > 0.03 ? 0.03 : opacity;
                if (lineOpacity > 0) {
                    let line = new Line(circle1.centreX, circle1.centreY,
                        circle2.centreX, circle2.centreY);
                    drawLine(context, line, lineOpacity);
                }
            }
        }
    }
}

// 让点动起来
function translate() {
    for (let i = 0; i < POINTS; i++) {
        let circle = circleArr[i];
        circle.centreX += circle.translateX;
        circle.centreY += circle.translateY;
        if (circle.centreX > WIDTH) circle.centreX = 0;
        else if (circle.centreX < 0) circle.centreX = WIDTH;
        if (circle.centreY > HEIGHT) circle.centreY = 0;
        else if (circle.centreY < 0) circle.centreY = HEIGHT;
    }
    draw();
}


//调用执行
window.onload = function() {
    init();
    setInterval(translate, 16);
}
