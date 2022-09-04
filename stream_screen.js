const RtspServer = require("rtsp-streaming-server").default;
const ffmpeg = require("ffmpeg-static");
const { spawn } = require("child_process");
let ip = "127.0.0.1";
require("dns").lookup(require("os").hostname(), function (err, add, fam) {
  ip = add;

  // console.log(ip);
});
const serverPort = 5554;
const clientPort = 6900;

// Server
const server = new RtspServer({
  serverPort: serverPort,
  clientPort: clientPort,
  rtpPortStart: 10000,
  rtpPortCount: 10000,
});

async function run() {
  try {
    await server.start();
  } catch (e) {
    console.error(e);
  }
}

run();

// Announcer (client)

const params = [
  "-re",
  "-probesize",
  "10M",
  "-f",
  "gdigrab",
  "-framerate",
  "60",
  "-video_size",
  "1920x1080",
  "-i",
  "desktop",
  "-crf",
  "0",
  "-c:v",
  "mpeg4",
  "-pix_fmt",
  "vulkan",
  "-preset",
  "ultrafast",
  "-f",
  "rtsp",
  // "-rtsp_transport",
  // "tcp",
  `rtsp://127.0.0.1:${serverPort}/screen`,
];

setTimeout(() => {
  const process = spawn(ffmpeg, params, { stdio: "pipe" });

  const stream = process.stdout;

  stream.on("data", (chunk) => {
    console.log(chunk.toString());
  });
  console.log("[STREAM] RTSP Opened.", `\nrtsp://${ip}:${clientPort}/screen`);
}, 2000);
