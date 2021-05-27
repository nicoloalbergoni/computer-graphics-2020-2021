var program;
var skyboxProgram;
var canvas;
var gl;
var baseDir;
var shaderDir;
var modelDir;

//Model
var skyboxVertPos;

//Textures
var skyboxTexture;

//Variables
var bgCol = [0.1, 0.1, 0.1, 1.0];
var cx = 0.0;
var cy = 0.0;
var cz = 10.0;
var angle = 0.01;
var elevation = 0.01;
var lookRadius = 10.0;

//Matrices
var viewMatrix;
var perspectiveMatrix;
var inverseViewProjMatrix;

//Buffers
var vao;
var skyboxVao;

//Uniforms
var mvpMat;
var mMat;
var nMat;
var inverseViewProjMatrixHandle;

var campPosHandle;

var skyboxTexHandle;
var reflCubemapHandle;

//Attributes
var vertPosAttr;
var vertNormAttr;
var skyboxVertPosAttr;


function LoadEnvironment(){
    skyboxVertPos = new Float32Array(
    [
      -1, -1, 1.0,
       1, -1, 1.0,
      -1,  1, 1.0,
      -1,  1, 1.0,
       1, -1, 1.0,
       1,  1, 1.0,
    ]);
    
    skyboxVao = gl.createVertexArray();
    gl.bindVertexArray(skyboxVao);
    
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, skyboxVertPos, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(skyboxVertPosAttr);
    gl.vertexAttribPointer(skyboxVertPosAttr, 3, gl.FLOAT, false, 0, 0);
    
    skyboxTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0+3);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture);
    
    var envTexDir = baseDir+"env/";
 
    const faceInfos = [
        {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, 
            url: envTexDir+'posx.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
            url: envTexDir+'negx.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 
            url: envTexDir+'posy.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
            url: envTexDir+'negy.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 
            url: envTexDir+'posz.jpg',
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 
            url: envTexDir+'negz.jpg',
        },
    ];
    faceInfos.forEach((faceInfo) => {
        const {target, url} = faceInfo;
        
        // Upload the canvas to the cubemap face.
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1024;
        const height = 1024;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        
        // setup each face so it's immediately renderable
        gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
        
        // Asynchronously load an image
        const image = new Image();
        image.src = url;
        image.addEventListener('load', function() {
            // Now that the image has loaded upload it to the texture.
            gl.activeTexture(gl.TEXTURE0+3);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture);
            gl.texImage2D(target, level, internalFormat, format, type, image);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        });
    
        
    });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    
}

function ClearBits(){
    gl.clearColor(bgCol[0], bgCol[1], bgCol[2], bgCol[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function SetViewportAndCanvas(){
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    ClearBits();
}

function GetAttributesAndUniforms(){
    //Uniforms
    skyboxTexHandle = gl.getUniformLocation(skyboxProgram, "u_texture"); 
    inverseViewProjMatrixHandle = gl.getUniformLocation(skyboxProgram, "inverseViewProjMatrix"); 
    skyboxVertPosAttr = gl.getAttribLocation(skyboxProgram, "in_position");
}

function SetMatrices(){
    viewMatrix = utils.MakeView(cx, cy, cz, 0.0, 0.0);
    perspectiveMatrix = utils.MakePerspective(30, gl.canvas.width/gl.canvas.height, 0.1, 100.0);
    
}

function DrawSkybox(){
    gl.useProgram(skyboxProgram);
    
    gl.activeTexture(gl.TEXTURE0+3);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture);
    gl.uniform1i(skyboxTexHandle, 3);
    
    var viewProjMat = utils.multiplyMatrices(perspectiveMatrix, viewMatrix);
    inverseViewProjMatrix = utils.invertMatrix(viewProjMat);
    gl.uniformMatrix4fv(inverseViewProjMatrixHandle, gl.FALSE, utils.transposeMatrix(inverseViewProjMatrix));
    
    gl.bindVertexArray(skyboxVao);
    gl.depthFunc(gl.LEQUAL);
    gl.drawArrays(gl.TRIANGLES, 0, 1*6);
}

function DrawScene(){
    ClearBits();
    
    gl.useProgram(program);
    
    angle = angle;// + rvy;
	elevation = elevation;// + rvx;
	
	cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
	cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
	cy = lookRadius * Math.sin(utils.degToRad(-elevation));
	viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);
    
    DrawSkybox();
        
    window.requestAnimationFrame(DrawScene);
}

function main(){
    SetViewportAndCanvas();
    SetMatrices();
    GetAttributesAndUniforms();
    
    DrawScene();
    
}

async function init(){
    var path = window.location.pathname;
    var page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '');
    shaderDir = baseDir+"shaders/"; 
    modelDir = baseDir+"models/";
    
    canvas = document.getElementById("c");
    gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("GL context not opened");
        return;
    }
    utils.resizeCanvasToDisplaySize(gl.canvas);
    
    canvas.addEventListener("mousedown", doMouseDown, false);
	canvas.addEventListener("mouseup", doMouseUp, false);
	canvas.addEventListener("mousemove", doMouseMove, false);
    
    await utils.loadFiles([shaderDir + 'skybox_vs.glsl', shaderDir + 'skybox_fs.glsl'], function (shaderText) {
        var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
        var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);

        skyboxProgram = utils.createProgram(gl, vertexShader, fragmentShader);
    });
    
    LoadEnvironment();
    
    main();
}

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


window.onload = init;