function setup() {
  createCanvas(1450,780);
  webgazer.begin();
  console.log("begin");
  frameRate(20);
}

var xprediction;
var yprediction;
webgazer.setGazeListener(function(data, elapsedTime) {
    if (data == null) {
        return;
    }
    xprediction = data.x; //these x coordinates are relative to the viewport 
    yprediction = data.y; //these y coordinates are relative to the viewport
    console.log(xprediction + ", " + yprediction);
}).begin();

function draw() {
  //var prediction = webgazer.getCurrentPrediction();
  //console.log("draw");
  ellipse(xprediction, yprediction, 80, 80);
}
