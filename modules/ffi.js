const ffi = require("ffi-napi");

const ObjEqual = (...objects) =>
  objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));

const user32 = ffi.Library("user32", {
  SetCursorPos: ["long", ["long", "long"]],
  GetSystemMetrics: ["long", ["long"]],
  mouse_event: ['void', ['int', 'int', 'int', 'int', 'int']]
});

module.exports = { user32 };


// MOUSEEVENTF_LEFTDOWN = 2;
// MOUSEEVENTF_LEFTUP = 4;

// user32.SetCursorPos(3, 3);

// user32.mouse_event(MOUSEEVENTF_LEFTDOWN, 0 ,0 ,0 ,0);
// user32.mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);