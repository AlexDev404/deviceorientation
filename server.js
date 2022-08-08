const express = require("express");
const app = express();

// Let's start parsing the incoming body as JSON
// We'll use the middleware ExpressJSON, which is based upon BodyParser

app.use(express.json());

// We listen on a port for requests

app.listen(80, () => {
  console.log(
    `Server has started listening on port ${80}`
  );
});

// Base Plate

app.post("/echo/json", (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});
