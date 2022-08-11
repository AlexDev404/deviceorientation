let ws;
const address = "ws://192.168.199.149:8010/";
let wsOpen = false;
if ("WebSocket" in window) {
  // Let us open a web socket
  ws = new WebSocket(address);

  ws.onopen = function () {
    // Web Socket is connected, send data using send()
    wsOpen = true;
  };
}

function handleOrientation(event, clickEvent) {
  // updateFieldIfNotNull("Orientation_a", event.alpha);
  // updateFieldIfNotNull("Orientation_b", event.beta);
  // updateFieldIfNotNull("Orientation_g", event.gamma);
  // console.log("Orientation_a", event.alpha);
  // console.log("Orientation_b", event.beta);
  // console.log("Orientation_g", event.gamma);
  // incrementEventCount();
  // sendToServer({ x: event.beta, y: event.gamma, z: event.alpha }, "ws://192.168.199.149:8010/");
  if (wsOpen) {
    if (clickEvent) {
      ws.send(JSON.stringify({ clicked: clickEvent }));
      return;
    }
    ws.send(JSON.stringify({ x: event.beta, y: event.gamma, z: event.alpha }));
  }
}

// function incrementEventCount() {
//   let counterElement = document.getElementById("num-observed-events");
//   let eventCount = parseInt(counterElement.innerHTML);
//   counterElement.innerHTML = eventCount + 1;
// }

function updateFieldIfNotNull(fieldName, value, precision = 10) {
  if (value != null)
    document.getElementById(fieldName).innerHTML = value.toFixed(precision);
}

function handleMotion(event) {
  // updateFieldIfNotNull(
  //   "Accelerometer_gx",
  //   event.accelerationIncludingGravity.x
  // );
  // updateFieldIfNotNull(
  //   "Accelerometer_gy",
  //   event.accelerationIncludingGravity.y
  // );
  // updateFieldIfNotNull(
  //   "Accelerometer_gz",
  //   event.accelerationIncludingGravity.z
  // );
  // updateFieldIfNotNull("Accelerometer_x", event.acceleration.x);
  // updateFieldIfNotNull("Accelerometer_y", event.acceleration.y);
  // updateFieldIfNotNull("Accelerometer_z", event.acceleration.z);
  // updateFieldIfNotNull("Accelerometer_i", event.interval, 2);
  // updateFieldIfNotNull("Gyroscope_z", event.rotationRate.alpha);
  // updateFieldIfNotNull("Gyroscope_x", event.rotationRate.beta);
  // updateFieldIfNotNull("Gyroscope_y", event.rotationRate.gamma);
  // incrementEventCount();
}

let is_running = false;
((e) => {
  // Request permission for iOS 13+ devices
  if (
    typeof DeviceMotionEvent != "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }

  if (is_running) {
    window.removeEventListener("devicemotion", handleMotion);
    window.removeEventListener("deviceorientation", (event) => {
      handleOrientation(event, false);
    });
    is_running = false;
  } else {
    window.addEventListener("devicemotion", handleMotion);
    window.addEventListener("deviceorientation", (event) => {
      handleOrientation(event, false);
    });
    is_running = true;
  }
})();

function bodyFullscreen() {
  if (document.body.requestFullscreen) {
    document.body.requestFullscreen();
  } else if (document.body.webkitRequestFullscreen) {
    /* Safari */
    document.body.webkitRequestFullscreen();
  } else if (document.body.msRequestFullscreen) {
    /* IE11 */
    document.body.msRequestFullscreen();
  }
}
