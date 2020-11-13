"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/gridhub").build();

connection.on("drawPixel",
    function (x, y, colour) {
        console.log("drawpixel siger hej");
        gitter.setPixel(x, y, colour);
    });

connection.start().catch(function (err) {
    return console.error(err.toString());
});

var Grid = function Grid(color = "lime") {
    //CANVAS MEMBERS:
    this.canvas = document.getElementById("canvas");
    this.wrap = document.getElementById("wrap");
    this.ctx = canvas.getContext("2d");
    this.canvasPos = canvas.getBoundingClientRect();
    this.color = color;

    // TIL GRUPPEN: apiCaller.getGitter() will be called here 

    // TIL GRUPPEN: apiCaller.keepMeUpdated() will be called here

    //SCROLL MEMBERS:
    this.scrollY = 0; this.scrollX = 0;
    this.canvasStyleSize = this.canvas.width;

    //PAN MEMBERS:
    this.dragStart = false;
    this.dragX; this.dragY;
    this.marginX = 0; this.marginY = 0;

    //MOUSE MOVE MEMBERS
    this.worldX;
    this.worldY;

    //RANDOM MEMBERS:
    this.ranFlag = 1;
    this.ranInterval;

    //SETUP:
    this.ctx.imageSmoothingEnabled = false;
    this.sizeCanvas(300, 300);
    this.sizeWrap(window.innerHeight - 150, window.innerWidth - 150);

    //EVENTS:
    window.addEventListener("click", this.clickHandle.bind(this), false);
    window.addEventListener("keydown", this.keydownHandle.bind(this), false);
    window.addEventListener("mousemove", this.mousemoveHandle.bind(this), false);
    this.wrap.addEventListener("DOMMouseScroll", this.mouseScrollHandle.bind(this), false);
    this.wrap.addEventListener("scroll", this.scrollHandle.bind(this), false);
    this.wrap.addEventListener("mousedown", this.mousedownHandle.bind(this), false);
    this.wrap.addEventListener("mouseup", this.mouseupHandle.bind(this), false);
}

// #region event handlers
Grid.prototype.scrollHandle = function (e) {
    this.scrollY = e.target.scrollTop;
    this.scrollX = e.target.scrollLeft;
}

Grid.prototype.mouseScrollHandle = function (e) {
    this.canvasStyleSize += e.detail * 10;
    this.sizeWrap(this.canvasStyleSize, this.canvasStyleSize);

    return e.preventDefault() && false;
}

Grid.prototype.keydownHandle = function (e) {
    switch (e.keyCode) {
        case 82:
            // r button
            if (this.ranFlag) {
                this.ranInterval = setInterval(this.randomPlace.bind(this), 1);
                this.ranFlag = false;
                break;
            }
            clearInterval(this.ranInterval);
            this.ranFlag = true;
            break;

        case 107:
            // + button
            this.canvasStyleSize += 50;
            this.canvas.style.width = this.canvasStyleSize + "px";
            this.canvas.style.height = this.canvasStyleSize + "px";
            break;

        case 109:
            // - button
            this.canvasStyleSize -= 50;
            this.canvas.style.width = this.canvasStyleSize + "px";
            this.canvas.style.height = this.canvasStyleSize + "px";
            break;

        default:
            // do nothing
    }
}

Grid.prototype.clickHandle = function (e) {
    let tempX = Math.floor(this.worldX);
    let tempY = Math.floor(this.worldY);

    // TIL GRUPPEN: apiCaller.PixelPlaceRequest(x, y, color) called here
    this.setPixel(tempX, tempY, this.color);

    connection.invoke("UpdateGrid", tempX, tempY, this.color).catch(function (err) {
        return console.error(err.toString());
    });
};

Grid.prototype.mousedownHandle = function (e) {
    if (e.which == 3) this.dragStart = true;
    this.dragX = e.pageX; // log start pos
    this.dragY = e.pageY;
}

Grid.prototype.mouseupHandle = function (e) {
    if (e.which == 3) this.dragStart = false;
}

Grid.prototype.mousemoveHandle = function (e) {
    this.calcWorldPos(e);

    if (!this.dragStart) return; // if mousedown event detected

    // change since start position?
    var deltaX = e.pageX - this.dragX;
    var deltaY = e.pageY - this.dragY;

    // add that change to margin
    this.marginX += deltaX;
    this.marginY += deltaY;

    // update margin
    this.pan(this.marginX, this.marginY);

    // refresh dragstart (or else change will be exponential)
    this.dragX = e.pageX;
    this.dragY = e.pageY;
}
// #endregion

// #region core methods

Grid.prototype.calcWorldPos = function (e) {
    // recalculate mouse cursors position in grid world:
    const styleDiff = this.canvas.width / this.canvasStyleSize;

    this.worldX = (e.pageX - canvas.offsetLeft + this.scrollX) * styleDiff;
    this.worldY = (e.pageY - canvas.offsetTop + this.scrollY) * styleDiff;
}

Grid.prototype.pan = function (x, y) {
    this.canvas.style.marginLeft = x + "px";
    this.canvas.style.marginTop = y + "px";
}

Grid.prototype.setPixel = function (x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, 1, 1);
    console.log("setpixel siger hej");
};

Grid.prototype.sizeCanvas = function (x, y) {
    this.canvas.height = y;
    this.canvas.width = x;
};

Grid.prototype.sizeWrap = function (x, y) {
    this.canvas.style.width = x + "px";
    this.canvas.style.height = y + "px";
};

Grid.prototype.addImage = function (image) {

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(image, 0, 0);
    console.log("addImage called!");
}
// #endregion

// #region test methods

Grid.prototype.randomPlace = function () {
    for (let i = 0; i < 1; i++) {
        this.setPixel(
            Math.floor(Math.random() * this.canvas.width),
            Math.floor(Math.random() * this.canvas.height),
            this.getRandomColor()
        );
    }
}

Grid.prototype.getRandomColor = function () {
    const letters = '0123456789ABCDEF';
    var color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// #endregion

Grid.prototype.renderImage = function () {
    console.log("renderimage!");

    var img = new Image();   // Create new img element
    img.src = "https://github.githubassets.com/images/icons/emoji/unicode/1f44d.png?v8";

    img.onload = function() {
        console.log(img);
        console.log("hej");
        this.ctx.drawImage(img, 0, 0);
    }

  this.ctx.drawImage(img, 0, 0);
};



/////////////////////////////////////main//////////////////////////////////////////

var gitter = new Grid();