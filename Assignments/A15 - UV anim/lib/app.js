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

var lookRadius = 5.0;

var esDef = [ ["Sliding road", 0.0, 1.0, 0.25, 0.25, 0.25, 0.0, 0.25, 0.25],
["Bumping code", 0.26, 0.9, 0.01, 0.01, 0.26, 0.9, 0.01, 0.01],
["Turning fan", 0.5, 1.0, 0.25, 0.25, 0.5, 0.25, 0.25, 0.25], 
["Burning flame", 0.26, 0.9, 0.01, 0.01, 0.26, 0.9, 0.01, 0.01] ];


function buildGeometry() {
	var i,j;
	
	// Draws a cube -- To do for the assignment.
	var vert2 = [[-1.0,-1.0,1.0, 0.0, 0.0,1.0, 0.0, 0.0], [1.0,-1.0,1.0, 0.0, 0.0,1.0, 1.0,0.0], [1.0,1.0,1.0, 0.0, 0.0,1.0, 1.0,1.0], [-1.0,1.0,1.0, 0.0, 0.0,1.0, 0.0,1.0], 
	[-1.0,-1.0,-1.0, 0.0, 0.0,-1.0,1.0,0.0], [1.0,-1.0,-1.0, 0.0, 0.0,-1.0, 0.0,0.0], [1.0,1.0,-1.0, 0.0, 0.0,-1.0,0.0,1.0], [-1.0,1.0,-1.0, 0.0,0.0,-1.0, 1.0, 1.0]];
	var ind2 = [0,1,2,  0,2,3, 4,6,5, 4,7,6];

	for(i=0; i<8; i++) {vert2[i+8] = [vert2[i][0],vert2[i][2],-vert2[i][1],vert2[i][3],vert2[i][5],-vert2[i][4], vert2[i][6],vert2[i][7]];
	vert2[i+16] = [vert2[i][2],vert2[i][1],-vert2[i][0],vert2[i][5],vert2[i][4],-vert2[i][3], vert2[i][6],vert2[i][7]];
	}
	for(i=0; i<12; i++) {ind2[i+12]=ind2[i]+8;ind2[i+24]=ind2[i]+16;}

	var color2 = [0.0, 1.0, 1.0];
	addMesh(vert2, ind2, color2);
	addMesh(vert2, ind2, color2);
	addMesh(vert2, ind2, color2);
	addMesh(vert2, ind2, color2);
	
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

out vec3 fs_pos;
out vec3 fs_norm;
out vec2 fs_uv;

void main() {
	fs_pos = in_pos;
	fs_norm = in_norm;
	fs_uv = in_uv;
	
	gl_Position = pMatrix * vec4(in_pos, 1);
}`;

// Fragment shader
var fs = `#version 300 es
precision highp float;

in vec3 fs_pos;
in vec3 fs_norm;
in vec2 fs_uv;

uniform vec4 lightDir1;
uniform vec4 lightDir2;
uniform vec4 lightDir3;
uniform vec4 overlay;
uniform vec4 overmask;
uniform float UVvis;
uniform mat4 tMatrix;

uniform sampler2D u_texture;

out vec4 color;

void main() {
	vec3 n_norm = normalize(fs_norm);
	
	float dimFact = lightDir1.w * clamp(dot(n_norm, lightDir1.xyz),0.0,1.0);
	dimFact += lightDir2.w * clamp(dot(n_norm, lightDir2.xyz),0.0,1.0) / 2.0;
	dimFact += lightDir3.w * clamp(dot(n_norm, lightDir3.xyz),0.0,1.0) / 3.0;
	dimFact = (dimFact + 0.25);
	vec2 uv = (tMatrix * vec4(fs_uv.x, 1.0-fs_uv.y, 0.0, 1.0)).xy;
	uv.y = 1.0 - uv.y;
	float msk = texture(u_texture, overmask.xy + overmask.zw*fs_uv).r; 
	vec3 col = texture(u_texture, uv).rgb * (1.0-msk) +
			   texture(u_texture, overlay.xy + overlay.zw*fs_uv).rgb * msk;
	color = vec4(min(col * dimFact * (1.0-UVvis) +
					UVvis * vec3(uv, 0.5), vec3(1.0, 1.0, 1.0)), 1.0);
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

var wireframeMode = 0;
var keyFunction =function(e) {
	if (e.keyCode == 32) {	// Space
		wireframeMode = (wireframeMode + 1) % 2;
	}	
}
window.addEventListener("keyup", keyFunction, false);


var totMesh = 0;
var startVertex = [0];
var startIndex = [0];
var vertices = [];
var normals = [];
var UVs = []
var indices = [];
var colors = [];
var startNormal = [];

function addMesh(i_vertices, i_indices, i_color) {
	var i;
//console.log(i_vertices);
	for(i = 0; i < i_vertices.length; i++) {
		vertices[(i + startVertex[totMesh]) * 3 + 0 ] = i_vertices[i][0];
		vertices[(i + startVertex[totMesh]) * 3 + 1 ] = i_vertices[i][1];
		vertices[(i + startVertex[totMesh]) * 3 + 2 ] = i_vertices[i][2];
		normals[ (i + startVertex[totMesh]) * 3 + 0 ] = i_vertices[i][3];
		normals[ (i + startVertex[totMesh]) * 3 + 1 ] = i_vertices[i][4];
		normals[ (i + startVertex[totMesh]) * 3 + 2 ] = i_vertices[i][5];
		UVs[ (i + startVertex[totMesh]) * 2 + 0 ] = i_vertices[i][6];
		UVs[ (i + startVertex[totMesh]) * 2 + 1 ] = 1-i_vertices[i][7];
	}
	for(i = 0; i < i_indices.length; i++) {
		indices[i + startIndex[totMesh]] = startVertex[totMesh] + i_indices[i];
	}
	colors[totMesh] = i_color;

	totMesh ++;	
	
	startVertex[totMesh] = startVertex[totMesh-1] + i_vertices.length;
	startIndex[totMesh] = startIndex[totMesh-1] + i_indices.length;	
}

function buildNormalBuffer() {
	k = startVertex[totMesh] * 3;
	kUV = startVertex[totMesh] * 2;
	h = startIndex[totMesh];
	for(i = 0; i < totMesh; i++) {
		startNormal[i] = h;
		for(j = startVertex[i] * 3; j < startVertex[i+1] * 3; j+=3) {
		  for(l = 0; l < 3; l++) {
			vertices[k] = vertices[j+l]; normals[k] = normals[j+l]; k++; 
		  }
		  UVs[kUV] = UVs[j/3*2]; UVs[kUV+1] = UVs[j/3*2+1]; kUV += 2;
		  indices[h] = k/3-1; h++;
		  for(l = 0; l < 3; l++) {
			vertices[k] = vertices[j+l] + normals[j+l]/5; normals[k] = normals[j+l]; k++;
		  }
		  UVs[kUV] = UVs[j/3*2]; UVs[kUV+1] = UVs[j/3*2+1]; kUV += 2;
		  indices[h] = k/3-1; h++;
		}
//console.log(i + " " + j + " " + k + " " + h);
	}
	startNormal[i] = h;
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
		buildNormalBuffer();
		
		document.getElementById("myRange").max = totMesh;
//console.log(totMesh);
//console.log(startVertex);
//console.log(startIndex);
//console.log(vertices);
//console.log(indices);
//console.log(colors);
		vertexBuffer = gl.createBuffer();
		vertices = new Float32Array(vertices);
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength, gl.STATIC_DRAW);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);

		normalBuffer = gl.createBuffer();
		normals = new Float32Array(normals);
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, normals.byteLength, gl.STATIC_DRAW);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, normals);

		UVBuffer = gl.createBuffer();
		UVs = new Float32Array(UVs);
		gl.bindBuffer(gl.ARRAY_BUFFER, UVBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, UVs.byteLength, gl.STATIC_DRAW);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, UVs);

		indexBuffer = gl.createBuffer();
		indices = new Uint16Array(indices);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
//console.log(indices.byteLength);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices.byteLength, gl.STATIC_DRAW);
		gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, indices);	



		// Create a texture
		imgtx = new Image();
		imgtx.onload = function() {
			var textureId = gl.createTexture();
			gl.activeTexture(gl.TEXTURE0 + 0);
			gl.bindTexture(gl.TEXTURE_2D, textureId);		
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgtx);		
		// set the filtering so we don't need mips
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_REPEAT_S, gl.CLAMP_TO_EDGE);
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_REPEAT_T, gl.CLAMP_TO_EDGE);
		}
		imgtx.src = TextureData;

		
		// links mesh attributes to shader attributes
		program.vertexPositionAttribute = gl.getAttribLocation(program, "in_pos");
		gl.enableVertexAttribArray(program.vertexPositionAttribute);

		program.vertexNormalAttribute = gl.getAttribLocation(program, "in_norm");
		gl.enableVertexAttribArray(program.vertexNormalAttribute);
		 
		program.vertexUVAttribute = gl.getAttribLocation(program, "in_uv");
		gl.enableVertexAttribArray(program.vertexUVAttribute);
		 
		program.WVPmatrixUniform = gl.getUniformLocation(program, "pMatrix");
		program.tMatrix = gl.getUniformLocation(program, "tMatrix");
		program.lightDir1 = gl.getUniformLocation(program, "lightDir1");
		program.lightDir2 = gl.getUniformLocation(program, "lightDir2");
		program.lightDir3 = gl.getUniformLocation(program, "lightDir3");
		program.overlay = gl.getUniformLocation(program, "overlay");
		program.overmask = gl.getUniformLocation(program, "overmask");
		program.normvis = gl.getUniformLocation(program, "normvis");
		program.UVvis = gl.getUniformLocation(program, "UVvis");
		program.textureUniform = gl.getUniformLocation(program, "u_texture");
		
		// prepares the world, view and projection matrices.
		var w=canvas.clientWidth;
		var h=canvas.clientHeight;
		
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.viewport(0.0, 0.0, w, h);

		// selects the mesh
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.vertexAttribPointer(program.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, UVBuffer);
		gl.vertexAttribPointer(program.vertexUVAttribute, 2, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);		
		
		var textureId = gl.createTexture();
		gl.activeTexture(gl.TEXTURE0 + 0);
		gl.bindTexture(gl.TEXTURE_2D, textureId);		
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgtx);		
	// set the filtering so we don't need mips
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

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

function drawNormals(slider) {
//	console.log(startNormal[slider+1] + " " + startNormal[slider] + " " + slider);
//	for(i=startNormal[slider];i<startNormal[slider+1];i++) {
//		console.log(indices[i]+" "+vertices.length);
//	}
	gl.drawElements(gl.LINES, startNormal[slider+1] - startNormal[slider], gl.UNSIGNED_SHORT, startNormal[slider]*2);
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
	var slider = document.getElementById("myRange").value - 1;
	
	output.innerHTML = (slider+1) + " - " + esDef[slider][0];

	
	perspProjectionMatrix = utils.MakePerspective(65, canvas.width / canvas.height, 0.1, 100.0)

	// update WV matrix
	cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
	cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
	cy = lookRadius * Math.sin(utils.degToRad(-elevation));
	viewMatrix = utils.MakeView(cx, cy, cz, elevation, -angle);
	projectionMatrix = utils.multiplyMatrices(perspProjectionMatrix, viewMatrix);

	t = (g_time - 5 * Math.floor(g_time/5)) / 5;
	var tMat = (slider == 0 ? Anim1(t) : (slider == 1 ? Anim2(t) :
			   (slider == 2 ? Anim3(t) : Anim4(t))));

	// draws the request
	gl.uniformMatrix4fv(program.WVPmatrixUniform, gl.FALSE, utils.transposeMatrix(projectionMatrix));
	gl.uniformMatrix4fv(program.tMatrix, gl.FALSE, utils.transposeMatrix(tMat));
	gl.uniform4f(program.lightDir1, gLightDir1[0], gLightDir1[1], gLightDir1[2], gLightDir1[3]);
	gl.uniform4f(program.lightDir2, gLightDir2[0], gLightDir2[1], gLightDir2[2], gLightDir2[3]);
	gl.uniform4f(program.lightDir3, gLightDir3[0], gLightDir3[1], gLightDir3[2], gLightDir3[3]);
		// sets the uniforms
		gl.uniform1i(program.textureUniform, 0);


   if(wireframeMode == 0) {
		gl.enable(gl.CULL_FACE);
		gl.uniform1f(program.normvis, 0.0);
		gl.uniform1f(program.UVvis, 0.0);
		gl.uniform4f(program.overlay, esDef[slider][1], 1-esDef[slider][2], esDef[slider][3], esDef[slider][4]);
		gl.uniform4f(program.overmask, esDef[slider][5], esDef[slider][6], esDef[slider][7], esDef[slider][8]);
		gl.drawElements(gl.TRIANGLES, startIndex[slider+1] - startIndex[slider],
					    gl.UNSIGNED_SHORT, startIndex[slider] * 2);
	} else if(wireframeMode == 1) {
		gl.uniform1f(program.normvis, 0.0);
		gl.uniform1f(program.UVvis, 1.0);
		gl.disable(gl.CULL_FACE);
		gl.uniform4f(program.overlay, esDef[slider][1], esDef[slider][2], esDef[slider][3], esDef[slider][4]);
		gl.uniform4f(program.overmask, esDef[slider][5], esDef[slider][6], esDef[slider][7], esDef[slider][8]);
		gl.drawElements(gl.TRIANGLES, startIndex[slider+1] - startIndex[slider],
					    gl.UNSIGNED_SHORT, startIndex[slider] * 2);
	}
	window.requestAnimationFrame(drawScene);		
}