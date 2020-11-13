window.addEventListener('load', () => {
    console.log("hello");
});

window.addEventListener("load", () => {
    var canvas = document.querySelector("#canvas");
    var ctx = canvas.getContext("2d");
    var canvasPos = canvas.getBoundingClientRect();
    // Resize
    canvas.height = 400;
    canvas.width = 400;

    ctx.strokeStyle = "red";
    ctx.strokeRect(20, 20, 50, 80);

    ctx.fillRect(6, 6, 1, 1);


    function placePixel(e) {

        console.log(e.clientX);

        ctx.fillRect(e.clientX - canvas.border, e.clientY - canvas.border, 3, 3);

    }


    canvas.addEventListener("mousedown", placePixel);
}
);
