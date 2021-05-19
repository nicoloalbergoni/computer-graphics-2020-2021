var vs = `#version 300 es

in vec3 inPosition;
in vec3 inNormal;

out vec3 fsPosition;
out vec3 fsNormal;

uniform mat4 matrix; 
uniform mat4 pMatrix;     //matrix to transform positions
uniform mat4 nMatrix;

void main() {
  fsNormal =  mat3(nMatrix) * inNormal;
  fsPosition = (pMatrix * vec4(inPosition, 1.0)).xyz;
  gl_Position = matrix * vec4(inPosition, 1.0);
}`;

var fs = `#version 300 es

precision mediump float;

in vec3 fsNormal;
in vec3 fsPosition; 
out vec4 outColor;

uniform vec3 mDiffColor; //material diffuse color 
uniform vec3 LAlightColor; //point light color 
uniform vec3 LAPos; //point light position
uniform float LATarget; //point light target
uniform float LADecay; //point light decay

void main() {
  
  vec3 lightColorA = LAlightColor * pow(LATarget / length(LAPos - fsPosition), LADecay);

  vec3 nNormal = normalize(fsNormal);
  vec3 lightDirNorm = normalize(LAPos - fsPosition);
  vec3 lambertColour = mDiffColor * lightColorA * dot(lightDirNorm,nNormal);

  outColor = vec4(clamp(lambertColour, 0.0, 1.0),1.0); 
}`;


function main() {

  var program = null;

  var cubeWorldMatrix = new Array();    //One world matrix for each cube...

  //Light params
  var lightColor = [0.1, 1.0, 1.0];
  var lightPos = [0.0, 1.5, 2.0,1.0];
  var lightTarget = 10;
  var lightDecay = 0;
  //Define material color
  var cubeMaterialColor = [0.5, 0.5, 0.5];

  var lastUpdateTime = (new Date).getTime();
  //Camera parameters
  var cx = 3.0;
  var cy = 3.0;
  var cz = 2.5;
  var elevation = -45.0;
  var angle = -40.0;

  var cubeRx = 0.0;
  var cubeRy = 0.0;
  var cubeRz = 0.0;

  cubeWorldMatrix[0] = utils.MakeWorld( -3.0, 0.0, -1.5, 0.0, 0.0, 0.0, 0.5);
  cubeWorldMatrix[1] = utils.MakeWorld( 3.0, 0.0, -1.5, 0.0, 0.0, 0.0, 0.5);
  cubeWorldMatrix[2] = utils.MakeWorld( 0.0, 0.0, -3.0, 0.0, 0.0, 0.0, 0.5);

  var canvas = document.getElementById("c");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    document.write("GL context not opened");
    return;
  }
  utils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.85, 0.85, 0.85, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, vs);
  var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, fs);
  var program = utils.createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");  
  var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");  
  var matrixLocation = gl.getUniformLocation(program, "matrix");
  var materialDiffColorHandle = gl.getUniformLocation(program, 'mDiffColor');
  var lightColorHandle = gl.getUniformLocation(program, 'LAlightColor');
  var vertexMatrixPositionHandle = gl.getUniformLocation(program, "pMatrix");
  var normalMatrixPositionHandle = gl.getUniformLocation(program, "nMatrix");

  var lightPosLocation = gl.getUniformLocation(program, "LAPos");
  var lightTargetLocation = gl.getUniformLocation(program, "LATarget");
  var lightDecayLocation = gl.getUniformLocation(program, "LADecay");

  var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width/gl.canvas.height, 0.1, 100.0);
  var viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);
    
  var vao = gl.createVertexArray();

  gl.bindVertexArray(vao);
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(normalAttributeLocation);
  gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW); 

  drawScene();

  function animate(){
    var currentTime = (new Date).getTime();
    if(lastUpdateTime){
      var deltaC = (30 * (currentTime - lastUpdateTime)) / 1000.0;
      cubeRx += deltaC;
      cubeRy -= deltaC;
      cubeRz += deltaC;
    }

    cubeWorldMatrix[3] = utils.MakeWorldNonUnif( 0.0, 0.0, 0.0, cubeRx, cubeRy, cubeRz, 1.0, 2.0, 1.0);  
      
    lastUpdateTime = currentTime;  
  }

  function drawScene() {
    animate();

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(i = 0; i < 4; i++){
      var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, cubeWorldMatrix[i]);
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);

      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));    
      gl.uniformMatrix4fv(vertexMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(viewWorldMatrix));
      var normalsMatrix = utils.invertMatrix(utils.transposeMatrix(viewWorldMatrix));
      gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalsMatrix));

      var lightPostransformed = utils.multiplyMatrixVector(viewMatrix, lightPos);
      gl.uniform3fv(lightPosLocation,  lightPostransformed.slice(0,3));

      gl.uniform3fv(materialDiffColorHandle, cubeMaterialColor);
      gl.uniform3fv(lightColorHandle,  lightColor);
      gl.uniform1f(lightTargetLocation,  lightTarget);
      gl.uniform1f(lightDecayLocation,  lightDecay);

      gl.bindVertexArray(vao);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );
    }
    
    window.requestAnimationFrame(drawScene);
  }

}

main();

