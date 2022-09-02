// cdn.webrtc-experiment.com/MediaStreamRecorder.js

let ws;
const address = "ws://192.168.199.100:8011/";
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

// const videoTag = document.getElementById("live");
// const myMediaSource = new MediaSource();
// const url = URL.createObjectURL(myMediaSource);
// videoTag.src = url;
// let audioSourceBuffer;
// let videoSourceBuffer;

// // 1. add source buffers
// function readySource() {
//   audioSourceBuffer = myMediaSource.addSourceBuffer(
//     'audio/mp4; codecs="mp4a.40.2"'
//   );
//   videoSourceBuffer = myMediaSource.addSourceBuffer(
//     'video/mp4; codecs="avc1.42E01E,mp4a.40.2"'
//   );
// }

// function checkReady() {
//   setTimeout(() => {
//     if (myMediaSource.readyState === "open") {
//       readySource();
//     } else {
//       checkReady();
//     }
//   }, 800);
// }
// checkReady();

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
    // document.getElementById("__preview").src = blobURL;
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

// /**
//  * Fetch a video or an audio segment, and returns it as an ArrayBuffer, in a
//  * Promise.
//  * @param {string} url
//  * @returns {Promise.<ArrayBuffer>}
//  */
// function fetchSegment(url) {
//   return fetch(url).then(function (response) {
//     return response.arrayBuffer();
//   });
// }

// // setInterval(() => {
// //   fetchSegment("http://localhost:8010/blob").then(function (videoSegment0) {
// //     videoSourceBuffer.appendBuffer(videoSegment0);
// //   });
// // }, 6000);
