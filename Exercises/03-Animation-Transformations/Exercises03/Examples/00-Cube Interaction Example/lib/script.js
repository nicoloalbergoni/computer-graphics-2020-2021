var canvas;
var gl = null;
var program = null;
var vao;
var indexBuffer;
var matrixLocation, positionAttributeLocation, colorAttributeLocation;

var projectionMatrix, 
  perspectiveMatrix,
  viewMatrix;

//Parameters for Camera
var cx = 0.5;
var cy = 0.0;
var cz = 1.0;
var elevation = 0.0;
var angle = -30.0;

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
    
  // Create a vertex array object (attribute state)
  vao = gl.createVertexArray();
  // and make it the one we're currently working with
  gl.bindVertexArray(vao);
    
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
  
  drawScene();
  }


  function drawScene() {
    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    // Compute the matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var zNear = 1;
    var zFar = 2000;
    var fieldOfViewDeg = 40;
    perspectiveMatrix = utils.MakePerspective(fieldOfViewDeg, aspect, zNear, zFar);

    viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);
    projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewMatrix);

    gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix)); 

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );
    
    //If you put this line of code here this function will be called every time the browser
    //renders a new frame, even if we didn't change the position of the camera
    //window.requestAnimationFrame(drawScene);
  }

function keyFunction(e){
 
      if (e.keyCode == 37) {  // Left arrow
        cx-=delta;
      }
      if (e.keyCode == 39) {  // Right arrow
        cx+=delta;
      } 
      if (e.keyCode == 38) {  // Up arrow
        cz-=delta;
      }
      if (e.keyCode == 40) {  // Down arrow
        cz+=delta;
      }
      if (e.keyCode == 171) { // Add
        cy+=delta;
      }
      if (e.keyCode == 173) { // Subtract
        cy-=delta;
      }
      
      if (e.keyCode == 65) {  // a
        angle-=delta*10.0;
      }
      if (e.keyCode == 68) {  // d
        angle+=delta*10.0;
      } 
      if (e.keyCode == 87) {  // w
        elevation+=delta*10.0;
      }
      if (e.keyCode == 83) {  // s
        elevation-=delta*10.0;
      }
    
      //If you put it here instead, you will redraw the cube only when the camera has been moved
      window.requestAnimationFrame(drawScene);
}

window.onload = main;
//'window' is a JavaScript object (if "canvas", it will not work)
window.addEventListener("keyup", keyFunction, false);

