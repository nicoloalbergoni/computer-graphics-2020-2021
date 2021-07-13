var canvas;

var gl = null,
	program = null;
	
var projectionMatrix, 
	perspProjectionMatrix,
	viewMatrix,
	worldMatrix;


//Parameters for Camera
var cx = 4.5;
var cy = 0.0;
var cz = 10.0;
var elevation = 0.0;
var angle = 0.0;

var lookRadius = 35.0;


		
// Vertex shader
var vs = `#version 300 es
#define POSITION_LOCATION 0

layout(location = POSITION_LOCATION) in vec3 in_pos;

uniform mat4 pMatrix;

out vec3 fs_pos;

void main() {
	fs_pos = in_pos;
	
	gl_Position = pMatrix * vec4(in_pos, 1);
}`;

// Fragment shader
var fs = `#version 300 es
precision highp float;

in vec3 fs_pos;

uniform vec4 lightDir1;
uniform vec4 lightDir2;
uniform vec4 lightDir3;
uniform vec4 matcol;

out vec4 color;

void main() {
	vec3 X = dFdx(fs_pos);
	vec3 Y = dFdy(fs_pos);
	vec3 n_norm = normalize(cross(X,Y));
	
	float dimFact = lightDir1.w * clamp(dot(n_norm, lightDir1.xyz),0.0,1.0);
	dimFact += lightDir2.w * clamp(dot(n_norm, lightDir2.xyz),0.0,1.0);
	dimFact += lightDir3.w * clamp(dot(n_norm, lightDir3.xyz),0.0,1.0);
	dimFact = dimFact * matcol.a + (1.0 - matcol.a);
	color = vec4(min(matcol.rgb * dimFact, vec3(1.0, 1.0, 1.0)), 1.0);
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
	var nLookRadius = lookRadius + event.wheelDelta/200.0;
	if((nLookRadius > 2.0) && (nLookRadius < 100.0)) {
		lookRadius = nLookRadius;
	}
}
function doResize() {
    // set canvas dimensions
	var canvas = document.getElementById("my-canvas");
    if((window.innerWidth > 40) && (window.innerHeight > 220)) {
		canvas.width  = window.innerWidth-16;
		canvas.height = window.innerHeight-180;
		gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    }
}

fingers = [0,0,0,0,0,0];

var wireframeMode = false;
var keyFunction =function(e) {
	if (e.keyCode == 32) {	// Space
		wireframeMode = !wireframeMode;
	}
}
window.addEventListener("keyup", keyFunction, false);


var totMesh = 0;
var startVertex = [0];
var startIndex = [0];
var vertices = [];
var indices = [];
var colors = [];

function addMesh(i_vertices, i_indices, i_color) {
	var i;
//console.log(i_vertices);
	for(i = 0; i < i_vertices.length; i++) {
		vertices[(i + startVertex[totMesh]) * 3 + 0 ] = i_vertices[i][0];
		vertices[(i + startVertex[totMesh]) * 3 + 1 ] = i_vertices[i][1];
		vertices[(i + startVertex[totMesh]) * 3 + 2 ] = i_vertices[i][2];
	}
	for(i = 0; i < i_indices.length; i++) {
		indices[i + startIndex[totMesh]] = startVertex[totMesh] + i_indices[i];
	}
	colors[totMesh] = i_color;

	totMesh ++;	
	
	startVertex[totMesh] = startVertex[totMesh-1] + i_vertices.length;
	startIndex[totMesh] = startIndex[totMesh-1] + i_indices.length;	
}


// The real app starts here
function main(){

	// setup everything else
	var canvas = document.getElementById("my-canvas");
	canvas.addEventListener("mousedown", doMouseDown, false);
	canvas.addEventListener("mouseup", doMouseUp, false);
	canvas.addEventListener("mousemove", doMouseMove, false);
	canvas.addEventListener("mousewheel", doMouseWheel, false);
	window.onresize = doResize;
	canvas.width  = window.innerWidth-16;
	canvas.height = window.innerHeight-180;

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

		// Creates  geometry
		buildGeometry();

		document.getElementById("myRange").value = BVH_FPS;
//console.log(totMesh);
//console.log(startVertex);
//console.log(startIndex);
//console.log(vertices);
//console.log(indices);
//console.log(colors);
		vertexBuffer = gl.createBuffer();
		vertices = new Float32Array(vertices);
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//console.log(vertices.byteLength);
		gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength, gl.STATIC_DRAW);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);

		indexBuffer = gl.createBuffer();
		indices = new Uint16Array(indices);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
//console.log(indices.byteLength);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices.byteLength, gl.STATIC_DRAW);
		gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, indices);	
//		
//		mesh = new OBJ.Mesh(objStr);
//		OBJ.initMeshBuffers(gl, mesh);
		
		// links mesh attributes to shader attributes
		program.vertexPositionAttribute = gl.getAttribLocation(program, "in_pos");
		gl.enableVertexAttribArray(program.vertexPositionAttribute);
		 
		program.WVPmatrixUniform = gl.getUniformLocation(program, "pMatrix");
		program.lightDir1 = gl.getUniformLocation(program, "lightDir1");
		program.lightDir2 = gl.getUniformLocation(program, "lightDir2");
		program.lightDir3 = gl.getUniformLocation(program, "lightDir3");
		program.matcol = gl.getUniformLocation(program, "matcol");
		
		// prepares the world, view and projection matrices.
		var w=canvas.clientWidth;
		var h=canvas.clientHeight;
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.viewport(0.0, 0.0, w, h);

		// selects the mesh
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);		
		
	 // turn on depth testing and back-face culling
	    gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		s45 = 0.707106781186548;
		s30 = 0.5;
		s60 = 0.866025403784439;

		gLightDir1 = [ 0.0, s45, s45, 1.0];
		gLightDir2 = [ s60, s45,-s45*s30, 0.7];
		gLightDir3 = [-s60,-s45,-s45*s30, 0.5];

		drawScene();
	}else{
		alert("Error: WebGL not supported by your browser!");
	}
}

TheScene = [
	  [40.00, 90.00, -120.00,  0,0, 0,  1, 1,     1,  1,  1],
	  [0.00,  0.00,  0.00,   0,0, 0,  2, 5,     1,  1,  1],
	  [3.43,  0.00,  0.00,   0,0, 0,  5, 5,     1,  1,  1], 
	  [-3.43, 0.00,  0.00,   0,0, 0,  8, 8,     1,  1,  1], 
	  [0.00,  4.57,  0.00,   0,0, 0,  11, 11,   1,  1,  1], 
	  [0.00, -18.47, 0.00,   0,0, 0,  6, 6,     1,  1,  1], 
	  [0.00, -17.95, 0.00,   0,0, 0,  7, 7,     1,  1,  1],
	  [0.00, -3.12,  0.00,   0,0, 0, -1,-1,     1,  1,  1], 
	  [0.00, -18.47, 0.00,   0,0, 0, 9,9,       1,  1,  1], 
	  [0.00, -17.95, 0.00,   0,0, 0, 10,10,       1,  1,  1], 
	  [0.00, -3.12,  0.00,   0,0, 0, -1,-1,     1,  1,  1], 
	  [0.00, 4.57,   0.00,   0,0, 0, 12,14,     1,  1,  1], 
	  [1.06, 15.33,  1.76,   0,0, 0, 15,15,     1,  1,  1], 
	  [-1.06,15.33,  1.76,   0,0, 0, 19,19,     1,  1,  1], 
	  [0.00, 17.62,  0.00,   0,0, 0, 23,23,     1,  1,  1], 
	  [5.81, 0.00,   0.00,   0,0, 0, 16,16,     1,  1,  1], 
	  [0.00, -12.08, 0.00,   0,0, 0, 17,17,     1,  1,  1], 
	  [0.00, -9.82,  0.00,   0,0, 0, 18,18,     1,  1,  1], 
	  [0.00, -7.37,  0.00,   0,0, 0, -1,-1,     1,  1,  1], 
	  [-5.81,0.00,   0.00,   0,0, 0, 20,20,     1,  1,  1], 
	  [0.00, -12.08, 0.00,   0,0, 0, 21,21,     1,  1,  1], 
	  [0.00, -9.82,  0.00,   0,0, 0, 22,22,     1,  1,  1], 
	  [0.00, -7.37,  0.00,   0,0, 0, -1,-1,     1,  1,  1], 
	  [0.00, 5.19,   0.00,   0,0, 0, 24,24,     1,  1,  1], 
	  [0.00, 4.14,   0.00,   0,0, 0, -1,-1,     1,  1,  1] 
	];
TheSceneP = [];
TheSceneP2 = [];
for(i = 0; i < TheScene.length; i++) {
	TheSceneP[i] = [];
	for(j = 0; j < 3; j++) {TheSceneP[i][j] = TheScene[i][j] / 3;}
	for(j = 3; j < 8; j++) {TheSceneP[i][j] = TheScene[i][j];}
	
	TheSceneP2[i] = [];
	for(j=0;j<8;j++) {TheSceneP2[i][j] = TheSceneP[i][j];}
}

function showAnimFrame(fi) {
	var i, f, st;
	f = fi % BVHframes;
	st = f * BVHchannles;

	for(i = 0; i < chas.length; i++) {
		TheSceneP[chas[i][0]][chas[i][1]] = BVH[st + i];
	}

	f = (fi+1) % BVHframes;
	st = f * BVHchannles;

	for(i = 0; i < chas.length; i++) {
		TheSceneP2[chas[i][0]][chas[i][1]] = BVH[st + i];
	}
}

function drawSceneTree(S, S2, a) {
	var i;

	var mats = [utils.identityMatrix()];
	for(i = 0; i < S.length; i++) {
		tm = InterpMat( S[i][0],  S[i][1],  S[i][2],  S[i][3],  S[i][4],  S[i][5],
					   S2[i][0], S2[i][1], S2[i][2], S2[i][3], S2[i][4], S2[i][5],
					   a);
		mats[i] = utils.multiplyMatrices(mats[i], tm);
		if(S[i][6] > 0) {
			for(j = S[i][6]; j <= S[i][7]; j++) {
				mats[j] = mats[i];
			}
		}
		draw(i, mats[i]);
	}
}

function draw(o, mat) {
	var slider = 0;
	scl = utils.MakeScaleNuMatrix(TheScene[o][8],TheScene[o][9],TheScene[o][10]);
	WVP = utils.multiplyMatrices(utils.multiplyMatrices(projectionMatrix, mat),scl);
	gl.uniformMatrix4fv(program.WVPmatrixUniform, gl.FALSE, utils.transposeMatrix(WVP));
		gl.drawElements(gl.TRIANGLES, startIndex[slider+1] - startIndex[slider],
					    gl.UNSIGNED_SHORT, startIndex[slider] * 2);
}

var lastUpdateTime;
var g_time = 0;

function drawScene() {
	// compute time interval
	var currentTime = (new Date).getTime();
	var deltaT;
	if(lastUpdateTime){
		deltaT = (currentTime - lastUpdateTime) / 1000.0;
	} else {
		deltaT = 1/50;
	}
	lastUpdateTime = currentTime;
	g_time += deltaT;

	// update perspective matrix
	var canvas = document.getElementById("my-canvas");
	g_time *= BVH_FPS;
	BVH_FPS = document.getElementById("myRange").value;
	g_time /= BVH_FPS;
	output.innerHTML = BVH_FPS;
	
	var slider = 0;
	perspProjectionMatrix = utils.MakePerspective(65, canvas.width / canvas.height, 0.1, 500.0)

	// update WV matrix
	cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
	cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
	cy = lookRadius * Math.sin(utils.degToRad(-elevation));
	viewMatrix = utils.MakeView(cx, cy, cz, elevation, -angle);
	projectionMatrix = utils.multiplyMatrices(perspProjectionMatrix, viewMatrix);

	// draws the request
	gl.uniform4f(program.lightDir1, gLightDir1[0], gLightDir1[1], gLightDir1[2], gLightDir1[3]);
	gl.uniform4f(program.lightDir2, gLightDir2[0], gLightDir2[1], gLightDir2[2], gLightDir2[3]);
	gl.uniform4f(program.lightDir3, gLightDir3[0], gLightDir3[1], gLightDir3[2], gLightDir3[3]);

		gl.uniform4f(program.matcol, colors[slider][0], colors[slider][1], colors[slider][2], 1.0);
	
	frame = Math.floor(g_time * BVH_FPS);
	alpha = g_time * BVH_FPS - frame;
	showAnimFrame(frame);
	drawSceneTree(TheSceneP, TheSceneP2, alpha);
		
	window.requestAnimationFrame(drawScene);		
}