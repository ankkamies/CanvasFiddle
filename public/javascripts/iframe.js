function resize_canvas() {
  var canvas = document.getElementById("output");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize_canvas();

window.addEventListener('message', function (event) {
  var mainWindow = event.source;
  var result = '';
  try {
    result = eval(event.data);
  } catch (e) {
    result = e.message;
  }
  mainWindow.postMessage(result, event.origin);
});
