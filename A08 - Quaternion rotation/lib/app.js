var canvas;

var gl = null,
	program = null,
	worldMesh = null,
	skybox = null,
	imgtx = null,
	skyboxLattx = null,
	skyboxTbtx = null;
	
var projectionMatrix, 
	perspectiveMatrix,
	viewMatrix,
	worldMatrix,
	gLightDir;
	
	
var targetRots = [
	utils.MakeWorld(0,0,0,   0,0,0,  1),
	utils.MakeWorld(0,0,0,  90,0,0,  1),
	utils.MakeWorld(0,0,0, 180,0,0,  1),
	utils.MakeWorld(0,0,0, -90,0,0,  1),
	utils.MakeWorld(0,0,0,  0,0,90,  1),
	utils.MakeWorld(0,0,0,  0,0,-90, 1),

	utils.MakeWorld(0,0,0,   0,90,0,  1),
	utils.MakeWorld(0,0,0,  90,90,0,  1),
	utils.MakeWorld(0,0,0, 180,90,0,  1),
	utils.MakeWorld(0,0,0, -90,90,0,  1),
	utils.MakeWorld(0,0,0,  0,90,90,  1),
	utils.MakeWorld(0,0,0,  0,90,-90, 1),

	utils.MakeWorld(0,0,0,   0,-90,0,  1),
	utils.MakeWorld(0,0,0,  90,-90,0,  1),
	utils.MakeWorld(0,0,0, 180,-90,0,  1),
	utils.MakeWorld(0,0,0, -90,-90,0,  1),
	utils.MakeWorld(0,0,0,  0,-90,90,  1),
	utils.MakeWorld(0,0,0,  0,-90,-90, 1),

	utils.MakeWorld(0,0,0,   0,180,0,  1),
	utils.MakeWorld(0,0,0,  90,180,0,  1),
	utils.MakeWorld(0,0,0, 180,180,0,  1),
	utils.MakeWorld(0,0,0, -90,180,0,  1),
	utils.MakeWorld(0,0,0,  0,180,90,  1),
	utils.MakeWorld(0,0,0,  0,180,-90, 1)
];

var targetRotIn = 0;



//Parameters for Camera
var cx = 0.0;
var cy = 0.0;
var cz = 60.5;
var elevation = 0.01;
var angle = 0.01;
var roll = 0.01;

var lookRadius = 10.0;


var keys = [];
var rvx = 0.0;
var rvy = 0.0;
var rvz = 0.0;

var keyFunctionDown =function(e) {
  if(!keys[e.keyCode]) {
  	keys[e.keyCode] = true;
	switch(e.keyCode) {
	  case 37:
//console.log("KeyUp   - Dir LEFT");
		rvy = rvy - 1.0;
		break;
	  case 39:
//console.log("KeyUp   - Dir RIGHT");
		rvy = rvy + 1.0;
		break;
	  case 38:
//console.log("KeyUp   - Dir UP");
		rvx = rvx + 1.0;
		break;
	  case 40:
//console.log("KeyUp   - Dir DOWN");
		rvx = rvx - 1.0;
		break;
	  case 81:
//console.log("KeyUp   - Dir ROLL LEFT");
		rvz = rvz + 1.0;
		break;
	  case 69:
//console.log("KeyUp   - Dir ROLL RIGHT");
		rvz = rvz - 1.0;
		break;
	}
  }
}

var keyFunctionUp =function(e) {
  if(keys[e.keyCode]) {
  	keys[e.keyCode] = false;
	switch(e.keyCode) {
	  case 37:
//console.log("KeyDown  - Dir LEFT");
		rvy = rvy + 1.0;
		break;
	  case 39:
//console.log("KeyDown - Dir RIGHT");
		rvy = rvy - 1.0;
		break;
	  case 38:
//console.log("KeyDown - Dir UP");
		rvx = rvx - 1.0;
		break;
	  case 40:
//console.log("KeyDown - Dir DOWN");
		rvx = rvx + 1.0;
		break;
	  case 81:
//console.log("KeyDown - Dir ROLL LEFT");
		rvz = rvz - 1.0;
		break;
	  case 69:
//console.log("KeyDown - Dir ROLL RIGHT");
		rvz = rvz + 1.0;
		break;
	  case 32:
	  	targetRotIn = Math.floor(targetRots.length * Math.random());
	}
  }
}
function doResize() {
    // set canvas dimensions
	var canvas = document.getElementById("my-canvas");
    if((window.innerWidth > 40) && (window.innerHeight > 240)) {
		canvas.width  = window.innerWidth-16;
		canvas.height = window.innerHeight-200;
		var w=canvas.clientWidth;
		var h=canvas.clientHeight;
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.viewport(0.0, 0.0, w, h);
		gl.clear(gl.COLOR_BUFFER_BIT);
		
		perspectiveMatrix = utils.MakePerspective(60, w/h, 0.1, 1000.0);

    }
}

		
// Vertex shader
var vs = `#version 300 es
#define POSITION_LOCATION 0
#define NORMAL_LOCATION 1
#define UV_LOCATION 2

layout(location = POSITION_LOCATION) in vec3 in_pos;
layout(location = NORMAL_LOCATION) in vec3 in_norm;
layout(location = UV_LOCATION) in vec2 in_uv;

uniform mat4 pMatrix;
uniform mat4 nMatrix;

out vec3 fs_pos;
out vec3 fs_norm;
out vec2 fs_uv;

void main() {
	fs_pos = in_pos;
	fs_norm = in_norm.xyz;
	fs_uv = vec2(in_uv.x, 1.0-in_uv.y);
	
	gl_Position = pMatrix * vec4(in_pos, 1.0);
}`;

// Fragment shader
var fs = `#version 300 es
precision highp float;

in vec3 fs_pos;
in vec3 fs_norm;
in vec2 fs_uv;

uniform vec4 lightDir;
//uniform float ambFact;

out vec4 color;

void main() {
	color = vec4(fs_norm * 0.4 + 0.6,1);
}`;

// event handler

var mouseState = false;
var lastMouseX = -100, lastMouseY = -100;
function doMouseDown(event) {
	lastMouseX = event.pageX;
	lastMouseY = event.pageY;
	mouseState = true;
}
function doMouseUp(event) {
	lastMouseX = -100;
	lastMouseY = -100;
	mouseState = false;
}
function doMouseMove(event) {
	if(mouseState) {
		var dx = event.pageX - lastMouseX;
		var dy = lastMouseY - event.pageY;
		lastMouseX = event.pageX;
		lastMouseY = event.pageY;
		
		if((dx != 0) || (dy != 0)) {
			angle = angle + 0.5 * dx;
			elevation = elevation + 0.5 * dy;
		}
	}
}
function doMouseWheel(event) {
	var nLookRadius = lookRadius + event.wheelDelta/1000.0;
	if((nLookRadius > 2.0) && (nLookRadius < 20.0)) {
		lookRadius = nLookRadius;
	}
}


// The real app starts here
function main(){
	
	// setup everything else
	var canvas = document.getElementById("my-canvas");
	canvas.addEventListener("mousedown", doMouseDown, false);
	canvas.addEventListener("mouseup", doMouseUp, false);
	canvas.addEventListener("mousemove", doMouseMove, false);
	canvas.addEventListener("mousewheel", doMouseWheel, false);
	window.addEventListener("keyup", keyFunctionUp, false);
	window.addEventListener("keydown", keyFunctionDown, false);
	window.onresize = doResize;
	canvas.width  = window.innerWidth-16;
	canvas.height = window.innerHeight-200;
	
	try{
		gl= canvas.getContext("webgl2");
	} catch(e){
		console.log(e);
	}
	
	if(gl){
		// Compile and link shaders
		program = gl.createProgram();
		var v1 = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(v1, vs);
		gl.compileShader(v1);
		if (!gl.getShaderParameter(v1, gl.COMPILE_STATUS)) {
			alert("ERROR IN VS SHADER : " + gl.getShaderInfoLog(v1));
		}
		var v2 = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(v2, fs)
		gl.compileShader(v2);		
		if (!gl.getShaderParameter(v2, gl.COMPILE_STATUS)) {
			alert("ERROR IN FS SHADER : " + gl.getShaderInfoLog(v2));
		}			
		gl.attachShader(program, v1);
		gl.attachShader(program, v2);
		gl.linkProgram(program);				
		
		gl.useProgram(program);

		// Load mesh using the webgl-obj-loader library
		worldMesh = new OBJ.Mesh(worldObjStr);
				
		// links mesh attributes to shader attributes
		program.vertexPositionAttribute = gl.getAttribLocation(program, "in_pos");
		gl.enableVertexAttribArray(program.vertexPositionAttribute);
		 
		program.vertexNormalAttribute = gl.getAttribLocation(program, "in_norm");
		gl.enableVertexAttribArray(program.vertexNormalAttribute);
		 
		program.textureCoordAttribute = gl.getAttribLocation(program, "in_uv");
		gl.enableVertexAttribArray(program.textureCoordAttribute);

		program.WVPmatrixUniform = gl.getUniformLocation(program, "pMatrix");
		program.NmatrixUniform = gl.getUniformLocation(program, "nMatrix");
		program.lightDir = gl.getUniformLocation(program, "lightDir");
//		program.ambFact = gl.getUniformLocation(program, "ambFact");
		
		OBJ.initMeshBuffers(gl, worldMesh);
		
		// prepares the world, view and projection matrices.
		var w=canvas.clientWidth;
		var h=canvas.clientHeight;
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.viewport(0.0, 0.0, w, h);
		gl.clear(gl.COLOR_BUFFER_BIT);
		
		perspectiveMatrix = utils.MakePerspective(5, w/h, 0.1, 1000.0);
		
	 // turn on depth testing
	    gl.enable(gl.DEPTH_TEST);
	    gl.enable(gl.CULL_FACE);
	
	
		// algin the skybox with the light
		gLightDir = [-1.0, 0.0, 0.0, 0.0];
		skyboxWM = utils.MakeRotateYMatrix(135);
		gLightDir = utils.multiplyMatrixVector(skyboxWM, gLightDir);
	
		drawScene();
	}else{
		alert("Error: WebGL not supported by your browser!");
	}
}

function drawScene() {
		viewMatrix = utils.MakeLookAt([cx - angle/10, cy - elevation/10, cz], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

		// Magic for moving the car
		dvecmat = updateWorld(-rvx*2, rvy*2, rvz*2);
//		dvecmat = utils.transposeMatrix(viewMatrix); dvecmat[12] = dvecmat[13] = dvecmat[14] = 0.0;
		worldMatrix = utils.multiplyMatrices(utils.MakeTranslateMatrix(-2,0,0),utils.multiplyMatrices(dvecmat, utils.MakeScaleMatrix(0.3)));

		worldMatrix2 = utils.multiplyMatrices(utils.MakeTranslateMatrix(2,0,0),utils.multiplyMatrices(utils.MakeScaleNuMatrix(0.3,0.3,0),targetRots[targetRotIn]));


		projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewMatrix);
		
		// draws the request
		gl.bindBuffer(gl.ARRAY_BUFFER, worldMesh.vertexBuffer);
		gl.vertexAttribPointer(program.vertexPositionAttribute, worldMesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
	    gl.bindBuffer(gl.ARRAY_BUFFER, worldMesh.textureBuffer);
	    gl.vertexAttribPointer(program.textureCoordAttribute, worldMesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, worldMesh.normalBuffer);
		gl.vertexAttribPointer(program.vertexNormalAttribute, worldMesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		 
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, worldMesh.indexBuffer);

		gl.uniform4f(program.lightDir, gLightDir[0], gLightDir[1], gLightDir[2], 0.2);
		WVPmatrix = utils.multiplyMatrices(projectionMatrix, worldMatrix);
		gl.uniformMatrix4fv(program.WVPmatrixUniform, gl.FALSE, utils.transposeMatrix(WVPmatrix));		
		gl.drawElements(gl.TRIANGLES, worldMesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);


		WVPmatrix = utils.multiplyMatrices(projectionMatrix, worldMatrix2);
		gl.uniformMatrix4fv(program.WVPmatrixUniform, gl.FALSE, utils.transposeMatrix(WVPmatrix));		
		gl.drawElements(gl.TRIANGLES, worldMesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		
		window.requestAnimationFrame(drawScene);		
}