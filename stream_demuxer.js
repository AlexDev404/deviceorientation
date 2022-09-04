const express = require("express");
const app = express();

const { proxy, scriptUrl } = require("rtsp-relay")(app);

const handler = proxy({
  url: `rtsp://127.0.0.1:6900/stream`,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: true,
  // transport: 'tcp'
  additionalFlags: ['-q', '1']
});

// the endpoint our RTSP uses
app.ws("/api/stream", handler);

// this is an example html page to view the stream
app.get("/", (req, res) =>
  res.send(`
  <body style="background: black; display: flex; align-items: center; justify-content: center;">
  <div style="display: flex; width: 100%;">
  <div style="flex: 1; border: 1px solid red">
  <canvas id='canvas' style="width: 100%"></canvas>
</div>
<div style="flex: 1; border: 1px solid red">
<canvas id='canvas1' style="width: 100%"></canvas>
</div>
</div>
  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'ws://' + location.host + '/api/stream',
      canvas: document.getElementById('canvas')
    });
    loadPlayer({
        url: 'ws://' + location.host + '/api/stream',
        canvas: document.getElementById('canvas1')
      });
  </script>
  </body>
`)
);


app.listen(2000);
console.log("[STREAM] Streamer Opened.");