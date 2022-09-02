const express = require("express");
const app = express();
const WebSocketServer = require("ws").Server;
const stream = require("websocket-stream");
const path = require("path");
const { user32 } = require("./modules/ffi");
const nativeX = user32.GetSystemMetrics(0);
const nativeY = user32.GetSystemMetrics(1);
const port = 8010;

const server = app.listen(port, () => {
  if (process.send) {
    process.send(`Server running on port ${port}\n\n`);
  }
});

app.use("/shell", express.static(path.join(__dirname, "shell/")));

// Gyro Server

// We then create a new variable which will store the actual server I'll be running
const ws = new WebSocketServer({
  // Then we set the parameter of httpServer to the server variable that we said that would be listening on the port specified
  //httpServer: server
  noServer: true,
});

server.on("upgrade", (request, socket, head) => {
  ws.handleUpgrade(request, socket, head, (websocket) => {
    ws.emit("connection", websocket, request);
  });
});

ws.on("connection", (websocketConnection) => {
  console.log("[CONNECTION] Client is Attempting To Connect!");

  websocketConnection.send(JSON.stringify(["OK"]));

  websocketConnection.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (error) {
      console.log("[CONNECTION] Format Unsupported.");
      return;
    }
    // console.log(data);
    if ("clicked" in data) {
      console.log(data.clicked);
      let MOUSEEVENTF_LEFTDOWN = 2;
      let MOUSEEVENTF_LEFTUP = 4;
      user32.mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
      user32.mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
      return;
    }
    let mouseX;
    (() => {
      let x = Math.round(
        (((Math.round(parseFloat(data.x) * (nativeX / 10)) * 10) / nativeX) *
          nativeX) /
          100 +
          nativeX / 2
      );

      // Prevent Zero-Error
      // if (x < 0) {
      //   x = nativeX / 2; // If zero, center
      // }

      // Prevent Continuity-Error for the left-hand side
      if (x < 0) {
        // x = nativeX;
        x = (x + 1536) * -1; // Artifical crap just like in Y haha
      }

      mouseX = x;
    })();

    let mouseY;
    // Calculation explanation
    //   (((accel_y * floor_resY * floor_resY) / nativeY) * nativeY) /
    //   speed +
    // nativeY / 2;

    (() => {
      let y = Math.round(
        (((Math.round(parseFloat(data.y) * (nativeY / 10)) * (nativeY / 10)) /
          nativeY) *
          nativeY) /
          220 -
          5000 * -1
      ); // Math hack lmao
      //+ (nativeY / 2) * 8;

      // if(y > 530){
      //   y = y - 300
      // }

      // Prevent Zero-Error
      // if (y < nativeY / 2 - 50) {
      //   // y = nativeY / 2 - 50;
      //   y = y;
      // }

      // Prevent Zero-Error
      // if (y < 0) {
      //   y = 0;
      // }

      // Prevent Continuity-Error and flip stuff up
      if (y > 5000) {
        y = y - 9543; // If zero, we artifically modify shit
      }
      // Prevent Overflow-Error
      // if (y > (nativeY / 2)*-1) {
      //   y = nativeY / 2;
      // }

      // Set to filtered-y

      mouseY = y;
    })();

    user32.SetCursorPos(mouseX, mouseY);
    console.log(mouseX, mouseY);
  });
});

// (((0.5 * 1920 * 100) / 1920) * 1920) / 100;

ws.on("close", () => {
  console.log("[CONNECTION] Client has disconnected.");
});

