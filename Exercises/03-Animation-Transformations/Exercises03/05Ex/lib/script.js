var canvas;
var gl = null;
var program = null;
var vao;
var indexBuffer;
var matrixLocation;

var projectionMatrix, 
  perspectiveMatrix,
  viewMatrix, worldMatrix, positionAttributeLocation, colorAttributeLocation;

// Wolrd Matrix parameters
var rz = 0.0;
var s = 1.0;

//Parameters for Camera
var cx = 0.5;
var cy = 0.0;
var cz = 3.0;
var elevation = 0.0;
var angle = 10.0;

var delta = 0.1;

var vertexShaderSource = `#version 300 es

in vec3 a_position;
in vec3 a_color;
out vec3 colorV;

uniform mat4 matrix; 
void main() {
  colorV = a_color;
  gl_Position = matrix * vec4(a_position,1.0);
}
`;

var fragmentShaderSource = `#version 300 es

precision mediump float;


in vec3 colorV;
out vec4 outColor;

void main() {
  outColor = vec4(colorV,1.0);
}
`;

function main() {

  // Get a WebGL context
  canvas = document.getElementById("c");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    document.write("GL context not opened");
    return;
  }
  utils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  //Setting the size for the canvas equal to half the browser window
  var w=canvas.clientWidth;
  var h=canvas.clientHeight;
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.viewport(0.0, 0.0, w, h);

  // create GLSL shaders, upload the GLSL source, compile the shaders and link them
  var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  program = utils.createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  // look up where the vertex data needs to go.
  positionAttributeLocation = gl.getAttribLocation(program, "a_position");  
  colorAttributeLocation = gl.getAttribLocation(program, "a_color");  
  matrixLocation = gl.getUniformLocation(program, "matrix");

  drawScene();
  }


  function drawScene() {

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW); 

    //Insert the missing matrices here :)
    worldMatrix = utils.MakeWorld(0.0, 0.0, 0.0, 0.0, 0.0, rz, s);
    viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);
    // Compute the matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var zNear = 1;
    var zFar = 2000;
    var fieldOfViewDeg = 40;
    perspectiveMatrix = utils.MakePerspective(fieldOfViewDeg, aspect, zNear, zFar);
    viewWorld = utils.multiplyMatrices(viewMatrix, worldMatrix);
    projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorld);

    gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix)); 

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );
    
  }

function keyFunction(e){
 //Insert your code here :)
 
  if (e.keyCode == 54) { // Button 6
    rz+=-5.0;
  } else if (e.keyCode == 55) { // Button 7
    rz+=5.0;
  } else if (e.keyCode == 49) { // Button 1
    s-=0.1;
  } else if (e.keyCode == 50) { // Button 2
    s+=0.1;
  }

  window.requestAnimationFrame(drawScene);
}

window.onload = main;
//'window' is a JavaScript object (if "canvas", it will not work)
window.addEventListener("keyup", keyFunction, false);

