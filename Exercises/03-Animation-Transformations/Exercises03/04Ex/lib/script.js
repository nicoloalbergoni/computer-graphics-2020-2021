var vertexShaderSource = `#version 300 es

in vec3 a_position;

out vec3 fs_pos;

uniform mat4 matrix; 
void main() {

  gl_Position = matrix * vec4(a_position,1.0);
  fs_pos = a_position;
}
`;

var fragmentShaderSource = `#version 300 es

precision mediump float;
in vec3 fs_pos;
out vec4 outColor;

void main() {
  outColor = vec4(fs_pos,1.0);
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
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // create GLSL shaders, upload the GLSL source, compile the shaders and link them
  var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var program = utils.createProgram(gl, vertexShader, fragmentShader);

  //We're going to see in a later lesson how to load 3D objects
  var model = new OBJ.Mesh(worldObjStr);
  var vertices = model.vertices;
  var indices = model.indices;

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");  
    
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW); 

  var matrixLoc = gl.getUniformLocation(program, "matrix");

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  var world_matrix = utils.MakeWorld(-10, 3, -5, 20, 47, 110, 2);
  var view_matrix = utils.MakeView(0, 2, 10, 15, 10);
  var Cwidht = gl.canvas.width;
  var Cheight = gl.canvas.height;
  var perspective_matrix = utils.MakePerspective(120, Cwidht/Cheight, 0.1, 100);

  var final_matrix = utils.multiplyMatrices(perspective_matrix, utils.multiplyMatrices(view_matrix, world_matrix));
  gl.uniformMatrix4fv(matrixLoc, gl.FALSE, utils.transposeMatrix(final_matrix));

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );
}

window.onload = main;

