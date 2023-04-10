let faceapi;
let video;
let detections;

const detectionOptions = {
    withLandmarks: true,
    withDescriptors: false,
  };
  

// Standard p5.js setup function called once
function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO); // captures video from webcam and renders in a <video> element
  video.size(width, height);
  video.hide();
  faceapi = ml5.faceApi(video, detectionOptions, modelReady)
}


// Invoke Face API detection using pre-trained model
function modelReady() {
    console.log('ready!')
    console.log(faceapi)
    faceapi.detect(gotResults)
}

// Callback function
function gotResults(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(result);
    detections = result;

    background(255);
    image(video, 0, 0, width, height);
    // draw the detected face's bounding box and landmarks 
    if (detections) {
        if (detections.length > 0) {
            drawBox(detections);
            drawLandmarks(detections)
        }
    }
    // recursively call face detection
    faceapi.detect(gotResults);
}

function drawBox(detections){
    for(let i = 0; i < detections.length; i++){
        const alignedRect = detections[i].alignedRect;
        const x = alignedRect._box._x
        const y = alignedRect._box._y
        const boxWidth = alignedRect._box._width
        const boxHeight  = alignedRect._box._height
        
        noFill();
        stroke(161, 95, 251);
        strokeWeight(2);
        rect(x, y, boxWidth, boxHeight);
    }
    
}

function drawLandmarks(detections){
    noFill();
    stroke(161, 95, 251)
    strokeWeight(2)

    for(let i = 0; i < detections.length; i++){
        const mouth = detections[i].parts.mouth; 
        const nose = detections[i].parts.nose;
        const leftEye = detections[i].parts.leftEye;
        const rightEye = detections[i].parts.rightEye;
        const rightEyeBrow = detections[i].parts.rightEyeBrow;
        const leftEyeBrow = detections[i].parts.leftEyeBrow;

        drawPart(mouth, true);
        drawPart(nose, false);
        drawPart(leftEye, true);
        drawPart(leftEyeBrow, false);
        drawPart(rightEye, true);
        drawPart(rightEyeBrow, false);

    }

}

function drawPart(feature, closed){
    
    beginShape();
    for(let i = 0; i < feature.length; i++){
        const x = feature[i]._x
        const y = feature[i]._y
        vertex(x, y)
    }
    
    if(closed === true){
        endShape(CLOSE);
    } else {
        endShape();
    }
    
}