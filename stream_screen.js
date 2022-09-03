const RtspServer = require("rtsp-streaming-server").default;
const ffmpeg = require("ffmpeg-static");
const { spawn } = require("child_process");
let ip = "192.168.199.100";
// require("dns").lookup(require("os").hostname(), function (err, add, fam) {
//   ip = add;

// console.log(ip);
// });

// Server
const server = new RtspServer({
  serverPort: 5554,
  clientPort: 6900,
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
const port = 5554;

const params = [
  "-re",
  "-probesize",
  "50M",
  "-f",
  "gdigrab",
  "-framerate",
  "60",
  "-i",
  "desktop",
  "-preset",
  "ultrafast",
  "-tune",
  "zerolatency",
  "-acodec",
  "libmp3lame",
  "-threads",
  "4",
  "-f",
  "rtsp",
  // "-rtsp_transport",
  // "tcp",
  `rtsp://${ip}:${port}/stream`,
];

const process = spawn(ffmpeg, params, { stdio: "pipe" });

const stream = process.stdout;

stream.on("data", (chunk) => {
  console.log(chunk.toString());
});
