var program;
var gl;

var model;

var vertices;
var normals;
var indices;
var positionAttributeLocation;
var normalsAttributeLocation;
var matrixLocation;
var perspectiveMatrix;
var viewMatrix;

var Rx = 0.0;
var Ry = 0.0;
var Rz = 0.0;
var S  = 0.5;

var keyFunctionDown = function(e) {
	switch(e.keyCode) {
	  case 37:
console.log("KeyUp   - Dir LEFT");
		Rx = Rx - 1.0;
		break;
	  case 39:
console.log("KeyUp   - Dir RIGHT");
    Rx = Rx + 1.0;
		break;
	  case 38:
console.log("KeyUp   - Dir UP");
Ry = Ry + 1.0;
		break;
	  case 40:
console.log("KeyUp   - Dir DOWN");
Ry = Ry - 1.0;
		break;
	}
  
}


function main() {
    utils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.85, 1.0, 0.85, 1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    vertices = model.vertices;
    normals = model.vertexNormals;
    indices = model.indices;

    console.log(normals);

    positionAttributeLocation = gl.getAttribLocation(program, "a_position");  
    normalsAttributeLocation = gl.getAttribLocation(program, "a_normal");  
    matrixLocation = gl.getUniformLocation(program, "matrix");  

    drawScene();
}
    
    function drawScene() {
    worldMatrix = utils.MakeWorld(Rx, Ry, Rz, 0.0, 0.0, 0.0, S);
    perspectiveMatrix = utils.MakePerspective(120, gl.canvas.width/gl.canvas.height, 0.1, 100.0);
    viewMatrix = utils.MakeView(0, 0.0, 3.0, 0.0, 0.0);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalsAttributeLocation);
    gl.vertexAttribPointer(normalsAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW); 
  
    utils.resizeCanvasToDisplaySize(gl.canvas);
    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
    var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);

    gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );

    window.requestAnimationFrame(drawScene);
}

function init(){

    var canvas = document.getElementById("c");

    window.addEventListener("keydown", keyFunctionDown, false);

    gl = canvas.getContext("webgl2");
    if (!gl) {
        document.write("GL context not opened");
        return;
    }

    var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    program = utils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
    
    model = new OBJ.Mesh(worldObjStr);
    
    main();
}

window.onload = init;

