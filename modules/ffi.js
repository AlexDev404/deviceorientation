const ffi = require("ffi-napi");

const ObjEqual = (...objects) =>
  objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));

const user32 = ffi.Library("user32", {
  SetCursorPos: ["long", ["long", "long"]],
  GetSystemMetrics: ["long", ["long"]],
});

module.exports = { user32 };
