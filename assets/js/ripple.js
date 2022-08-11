//Ripple Event Handler
function drawRipple(ev) {
  let x = ev.clientX;
  let y = ev.clientY;
  let node = document.querySelector(".ripple");
  let newNode = node.cloneNode(true);
  newNode.classList.add("animate");
  newNode.style.left = ev.clientX - 5 + "px";
  newNode.style.top = ev.clientY - 5 + "px";
  node.parentNode.replaceChild(newNode, node);

}

//Ripple Triggers
window.addEventListener("click", (event) => {
  handleOrientation(false, true)
  drawRipple(event);
});

//Control Handler
function controlHandler() {
  document.body.classList.toggle("dark");
}

// Control Trigger
const controller = document.getElementById("controller");
controller.addEventListener("click", () => {
  controlHandler();
});
