"use strict";

function autoResizeCanvas(canvas) {
    const expandFullScreen = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    expandFullScreen();
    // Resize screen when the browser has triggered the resize event
    window.addEventListener('resize', expandFullScreen);
  }


function main() {
  var canvas = document.getElementById("my-canvas");
  autoResizeCanvas(canvas);
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("GL context not opened");
    return;
  }else{
    alert("Success")
  }
  
}

window.onload = main;


