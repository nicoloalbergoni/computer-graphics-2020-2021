var vertexShaderSource = `#version 300 es

in vec3 a_position;

uniform mat4 matrix; 
void main() {

  gl_Position = matrix * vec4(a_position,1.0);
}
`;

var fragmentShaderSource = `#version 300 es

precision mediump float;

out vec4 outColor;

void main() {
  outColor = vec4(1.0,0.0,0.0,1.0);
}
`;

function main() {
  // Get a WebGL context
  var canvas = document.getElementById("c");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    document.write("GL context not opened");
    return;
  }
  utils.resizeCanvasToDisplaySize(gl.canvas);
  
  //use this aspect ratio to keep proportions
  var aspect_ratio = canvas.width*1.0/canvas.height;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // create GLSL shaders, upload the GLSL source, compile the shaders and link them
  var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var program = utils.createProgram(gl, vertexShader, fragmentShader);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");  
  var matrixLocation = gl.getUniformLocation(program, "matrix");
    
  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW); 

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  var perspectiveMatrix = utils.MakePerspective(90, aspect_ratio, 0.1, 100.0);//*****NEW*****//
  var viewMatrix = utils.MakeView(0.5, 0.0, 1.0, 0.0, -30.0);//*****NEW*****//
  var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewMatrix);//*****NEW*****//

  //Set a the matrix as uniform. Pay attention! this line must be after "useProgram" otherwise
  //webgl is not able to find the matrixLocation, and then to set its value 
  gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix)); 

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );
}

window.onload = main;

