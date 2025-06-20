

const URL = "https://teachablemachine.withgoogle.com/models/DC1pz5qNm/";
const simpleURL = "https://teachablemachine.withgoogle.com/models/7kMYgTbdq/"
let img, model, maxPredictions, labelContainer;
let modelTwo, maxPredictionsTwo;
let prevPredict = 0;
let currentPredict = 0.000000001;
let prevPredictTwo = 0;
let currentPredictTwo = 0.000000001;
const fileInput = document.getElementById('imageUpload');
const imageContainer = document.getElementById('imageContainer');
const resetButton = document.getElementById("reset-btn")

fileInput.addEventListener('change', function(event) {
  const file = event.target.files[0]; // Get the first file selected

  if (file) {
    const reader = new FileReader();

    reader.onload = function(e) {
      img.src = e.target.result;
    };

    reader.readAsDataURL(file); // Read the file as a data URL
  }
});

async function init() {
    // Load the model first
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';
    const modelURLTwo = simpleURL + 'model.json';
    const metadataURLTwo = simpleURL + 'metadata.json';
    model = await tmImage.load(modelURL, metadataURL);
    modelTwo = await tmImage.load(modelURLTwo, metadataURLTwo);
    maxPredictions = model.getTotalClasses();
    maxPredictionsTwo = modelTwo.getTotalClasses();
    console.log(maxPredictions);
    
    // Get the actual image element from the div
    img = document.querySelector("#cancer-image img");
    labelContainer = document.getElementById('label-container');
    
    // Create label containers after we know maxPredictions
    labelContainer.appendChild(document.createElement('div'));
    
    // Start the prediction loop
    loop();
}

async function loop() {
    if ((currentPredict != prevPredict)&&(currentPredictTwo != prevPredictTwo)) {
        await predict();
    }
    requestAnimationFrame(loop); // Continue the loop
}

async function predict() {
    // predict can take in an image, video or canvas html element
    const predictionTwo = await modelTwo.predict(img);
    currentPredictTwo = predictionTwo[0].probability.toFixed(2);
    if (predictionTwo[0].probability.toFixed(2) > predictionTwo[1].probability.toFixed(2)) {
      labelContainer.Container.childNodes[0].innerHTML = "Based off your image, our model claims the mole is benign with a confidence of roughly" + predictionTwo[0].probability.toFixed
    }
    else {
    const prediction = await model.predict(img);
    currentPredict = prediction[0].probability.toFixed(2);
    let championGuess = 0;
    let championName = '';
    for (let i = 0; i < maxPredictions; i++) {
      if (prediction[i].probability.toFixed(2)>championGuess) {
        championGuess = prediction[i].probability.toFixed(2)
        championName = prediction[i].className
      }
    }
        const classPrediction =
            "Based off your image, our model claims a case of "+championName + ' with a confidence of roughly ' + (championGuess*100) + "%";
        labelContainer.childNodes[0].innerHTML = classPrediction;
    prevPredict = prediction[0].probability.toFixed(2);
    }
}


resetButton.addEventListener("click", function() {
  predict();
});


navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(function(stream) {
    const video = document.getElementById('camera');
    video.srcObject = stream;
    video.play();
  })
  .catch(function(err) {
    console.error("Error accessing the camera: ", err);
  });

const captureBtn = document.getElementById('capture-btn');
const canvas = document.getElementById('photo');
const context = canvas.getContext('2d');

captureBtn.addEventListener('click', () => {
  const video = document.getElementById('camera');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  let imageDataUrl = canvas.toDataURL('image/jpeg'); // or 'image/png'
  console.log(imageDataUrl);
  img.src = imageDataUrl;
});

function handleVideo(cameraFacing) {
  const constraints = {
    video: {
      facingMode: {
        exact: cameraFacing
      }
    }
  }
  return constraints
};

function turnVideo(constraints) {
  let video;
  navigator.mediaDevices.getUserMedia(constraints);

}

document.querySelector(".frontCamera").addEventListener("click", () => {
  turnVideo(handleVideo("user"));
})
document.querySelector(".backCamera").addEventListener("click", () => {
  turnVideo(handleVideo("environment"));
})

init();
