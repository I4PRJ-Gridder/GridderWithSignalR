var ApiCaller = function ApiCaller() {


}

ApiCaller.prototype.pixelPlaceRequest = function(x, y, color) {
    // Laver en post(?) til API med en JSON version af "pixelRequest" objekt (Se bunden af apicaller)

    // Test med get
    let request = new XMLHttpRequest();

    request.open("GET", "https://jsonplaceholder.typicode.com/posts");
    request.send();
    request.onload = () => {
        console.log(request);
        if (request.status == 200) {
            console.log(JSON.parse(request.response));

            var myObj = JSON.parse(request.response);


            console.log("!!!!!!" + myObj[0].title + "!!!");

        } else {
            console.log(`error ${request.status} ${request.statusText}`)
        }
    }

}

ApiCaller.prototype.keepMeUpdated = function(Grid) {
    // Sæt grid reference på liste
    // Send keep me updated request til API
    // Lyt efter updates fra API

    // I tilfælde af update: Kald setPixel() eller lignende på grid.
}

ApiCaller.prototype.stopUpdating = function(Grid) {
    // Stop med at opdatere fra API

}

ApiCaller.prototype.getGitter = function () {
    
    // Kalder get gitter på API og modtager hele gitteret.
    // Modtager image eller blob?


    // Inpsired by: https://stackoverflow.com/questions/50248329/fetch-image-from-api

    console.log("GITTERGET!");

    var fetchURL = "https://github.githubassets.com/images/icons/emoji/unicode/1f44d.png?v8";

    var gitterImage;

    

    fetch(fetchURL)
        .then(response => response.blob())
        .then(images => {
            // Then create a local URL for that image and print it 
            gitterImage = URL.createObjectURL(images);
            console.log(gitterImage);
        });

    return gitterImage;
}



var PixelRequest = function PixelRequest() {
    this.x;
    this.y;
    this.color;

}

