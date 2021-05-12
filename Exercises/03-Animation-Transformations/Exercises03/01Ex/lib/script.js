var vertexShaderSource = `#version 300 es

in vec4 a_position;

uniform mat4 matrix; //*****NEW*****// 
void main() {

  gl_Position = matrix * a_position;//*****NEW*****// 
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

  var positions = [
      0 , 0.0 * aspect_ratio,0.0,1.0,
      0 , 0.3 * aspect_ratio,0.0,1.0,
      0.3  , 0.0 * aspect_ratio,0.0,1.0
    ];
  var indices = [0,1,2];
    
  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 4, gl.FLOAT, false, 0, 0);
    
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW); 

  var matrixLoc = gl.getUniformLocation(program, "matrix");
  
  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);
  
  var translate_matrix  = utils.MakeTranslateMatrix(-0.8, 0.3, 0.0);
  gl.uniformMatrix4fv(matrixLoc, gl.FALSE, utils.transposeMatrix(translate_matrix));

  //Just to be sure this is the currently bound IBO
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );
}

window.onload = main;

