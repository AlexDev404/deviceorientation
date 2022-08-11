// cdn.webrtc-experiment.com/MediaStreamRecorder.js

let ws;
const address = "ws://192.168.199.149:8011/";
let wsOpen = false;
if ("WebSocket" in window) {
  // Let us open a web socket
  ws = new WebSocket(address);

  ws.onopen = function () {
    // Web Socket is connected, send data using send()
    wsOpen = true;
  };
}

var mediaConstraints = {
  audio: true,
  video: true,
};

(async () => {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
    onMediaSuccess(stream);
  } catch (error) {
    onMediaError(error);
  }
})();

function onMediaSuccess(stream) {
  // console.log(stream);
  var mediaRecorder = new MediaStreamRecorder(stream);
  mediaRecorder.mimeType = "video/webm";
  mediaRecorder.ondataavailable = function (blob) {
    // POST/PUT "Blob" using FormData/XHR2
    var blobURL = URL.createObjectURL(blob);
    // blobToBuffer(blob).then(console.log);
    buffToServer(blob);
    //      document.write('<a href="' + blobURL + '">' + blobURL + "</a>");
    z.src = blobURL;
  };
  mediaRecorder.start(5000);
}

function onMediaError(e) {
  console.error("media error", e);
}

const blobToBuffer = async (blob) => {
  const buffer = await blob.arrayBuffer();
  return buffer;
};

function buffToServer(blob) {
  const blobbish = blobToBuffer(blob);
  if (wsOpen) {
    ws.send(blob);
  }
}
