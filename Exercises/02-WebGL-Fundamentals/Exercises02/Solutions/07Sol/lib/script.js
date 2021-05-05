"use strict";

//Utility function to compile the shaders
function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {    
    return shader;
  }else{
    console.log(gl.getShaderInfoLog(shader));  // eslint-disable-line
    gl.deleteShader(shader);
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }

}
//Utility function to create and link the GLSL ES program
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }else{
     throw ("program filed to link:" + gl.getProgramInfoLog (program));
     console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
     gl.deleteProgram(program);
     return undefined;
  }
}

//Utility function to resize the canvas to full screen
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
  // Get the canvas and grab a WebGL context
  var canvas = document.getElementById("my-canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("GL context not opened");
    return;
  }
  autoResizeCanvas(canvas);
  
  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader);

  //******Initialisation of variables******/
  var colour = [252.0/255.0, 186.0/255.0, 3.0/255.0];
  var colour_choice = 0.0;
  var second_colour = [29.0/255.0, 219.0/255.0];

  //******Retrieving the uniforms locations******/
  var colourLocation = gl.getUniformLocation(program, "u_colour");
  var colourChoiceLocation = gl.getUniformLocation(program, "colour_choice");
  var secondColourLocation = gl.getUniformLocation(program, "u_second_colour");

  //x,y for each vertex
  var positions = [
        0.2, 0.1,
        0.5, 0.9,
        0.8, 0.7
  ];

  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER because it's going to contain attribute data
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  //Send data in positions to the currently-bound buffer in the gpu
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
  //Look up where the vertex data needs to go.
  //Assume vec4 a_position attribute in GLSL representing the position of the vertices
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  //Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward stride * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, gl.FLOAT, normalize, stride, offset);

  //Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  //Clear the canvas
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //Tell it to use our program 
  gl.useProgram(program);

  //******Passing all the uniforms******/
  gl.uniform3fv(colourLocation, colour);
  gl.uniform1f(colourChoiceLocation, colour_choice);
  gl.uniform2fv(secondColourLocation, second_colour);

  //Draw call
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

//Call the main function once the html has finished loading
window.onload = main;


