var program;
var canvas;
var gl;
var baseDir;
var shaderDir;
var perspectiveMatrix;
var viewMatrix;
var cx = 0.0, cy = 0.0, cz = 20.0;
var objectsInScene;
var colours;

function main() {

  objectsInScene = new Array();
  var sphereWorldMatrix = new Array();
  var positionAttributeLocation = new Array(); 
  var matrixLocation = new Array();
  var sphereColorHandle = new Array();
  var vaos = new Array();
  colours = new Array();
  for(i = 0; i < 3; i++){
      colours[i] = [Math.random(), Math.random(), Math.random(), 1];
  }

  sphereWorldMatrix[0] = utils.MakeWorld( -4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
  sphereWorldMatrix[1] = utils.MakeWorld( 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
  sphereWorldMatrix[2] = utils.MakeWorld( 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
    
  //Save centre and radius of each sphere
  //Remember to update these variables if you move the objects
  //The radius is specified in the initSphere function at 1.5
  objectsInScene[0] = [[-4.0, 0.0, 0.0], 1.5]
  objectsInScene[1] = [[0.0, 0.0, 0.0], 1.5]
  objectsInScene[2] = [[4.0, 0.0, 0.0], 1.5]

  //Loads all the data required to draw a sphere
  var numIdx = initSphere();

  //SET Global states (viewport size, viewport background color, Depth test)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.85, 0.85, 0.85, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  for(i = 0; i < sphereWorldMatrix.length; i++){
    //Unlit
    positionAttributeLocation[i] = gl.getAttribLocation(program, "inPosition"); 
    matrixLocation[i] = gl.getUniformLocation(program, "matrix");
    sphereColorHandle[i] = gl.getUniformLocation(program, "colour");
  }
  
  perspectiveMatrix = utils.MakePerspective(30, gl.canvas.width/gl.canvas.height, 0.1, 100.0);
  viewMatrix = utils.MakeView(cx, cy, cz, 0.0, 0.0);
    
  for(i = 0; i < 3; i++){
    vaos[i] = gl.createVertexArray();

    gl.bindVertexArray(vaos[i]);
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation[i]);
    gl.vertexAttribPointer(positionAttributeLocation[i], 3, gl.FLOAT, false, 0, 0);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW); 
  }

  drawScene();

  function drawScene() {

    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(i = 0; i < 3; i++){
      gl.useProgram(program);
      var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, sphereWorldMatrix[i]);
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
      gl.uniformMatrix4fv(matrixLocation[i], gl.FALSE, utils.transposeMatrix(projectionMatrix));
      gl.uniform4fv(sphereColorHandle[i], colours[i]);
      gl.bindVertexArray(vaos[i]);
      gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_SHORT, 0 );
    }
    
    window.requestAnimationFrame(drawScene);
  }
    
    
} 

//This algorithm is taken from the book Real Time Rendering fourth edition
function raySphereIntersection(rayStartPoint, rayNormalisedDir, sphereCentre, sphereRadius){
        //Distance between sphere origin and origin of ray
        var l = [sphereCentre[0] - rayStartPoint[0], sphereCentre[1] - rayStartPoint[1], sphereCentre[2] - rayStartPoint[2]];
        var l_squared = l[0] * l[0] + l[1] * l[1] + l[2] * l[2];
        //If this is true, the ray origin is inside the sphere so it collides with the sphere
        if(l_squared < (sphereRadius*sphereRadius)){
            console.log("ray origin inside sphere");
            return true;
        }
        //Projection of l onto the ray direction 
        var s = l[0] * rayNormalisedDir[0] + l[1] * rayNormalisedDir[1] + l[2] * rayNormalisedDir[2];
        //The spere is behind the ray origin so no intersection
        if(s < 0){
            console.log("sphere behind ray origin");
            return false;
        }
        //Squared distance from sphere centre and projection s with Pythagorean theorem
        var m_squared = l_squared - (s*s);
        //If this is true the ray will miss the sphere
        if(m_squared > (sphereRadius*sphereRadius)){
            console.log("m squared > r squared");
            return false;
        }
        //Now we can say that the ray will hit the sphere 
        console.log("hit");
        return true;
        
    }

function normaliseVector(vec){
    var magnitude = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
    console.log("Magnitude" + magnitude);
    var normVec = [vec[0]/magnitude, vec[1]/magnitude, vec[2]/magnitude];
    return normVec;
}


function myOnMouseUp(ev){
        //These commented lines of code only work if the canvas is full screen
        /*console.log("ClientX "+ev.clientX+" ClientY "+ev.clientY);
        var normX = (2*ev.clientX)/ gl.canvas.width - 1;
        var normY = 1 - (2*ev.clientY) / gl.canvas.height;
        console.log("NormX "+normX+" NormY "+normY);*/
    
        //This is a way of calculating the coordinates of the click in the canvas taking into account its possible displacement in the page
        var top = 0.0, left = 0.0;
        canvas = gl.canvas;
        while (canvas && canvas.tagName !== 'BODY') {
            top += canvas.offsetTop;
            left += canvas.offsetLeft;
            canvas = canvas.offsetParent;
        }
        console.log("left "+left+" top "+top);
        var x = ev.clientX - left;
        var y = ev.clientY - top;
            
        //Here we calculate the normalised device coordinates from the pixel coordinates of the canvas
        console.log("ClientX "+x+" ClientY "+y);
        var normX = (2*x)/ gl.canvas.width - 1;
        var normY = 1 - (2*y) / gl.canvas.height;
        console.log("NormX "+normX+" NormY "+normY);

        //We need to go through the transformation pipeline in the inverse order so we invert the matrices
        var projInv = utils.invertMatrix(perspectiveMatrix);
        var viewInv = utils.invertMatrix(viewMatrix);
        
        //Find the point (un)projected on the near plane, from clip space coords to eye coords
        //z = -1 makes it so the point is on the near plane
        //w = 1 is for the homogeneous coordinates in clip space
        var pointEyeCoords = utils.multiplyMatrixVector(projInv, [normX, normY, -1, 1]);
        console.log("Point eye coords "+pointEyeCoords);
    
        //This finds the direction of the ray in eye space
        //Formally, to calculate the direction you would do dir = point - eyePos but since we are in eye space eyePos = [0,0,0] 
        //w = 0 is because this is not a point anymore but is considered as a direction
        var rayEyeCoords = [pointEyeCoords[0], pointEyeCoords[1], pointEyeCoords[2], 0];

        
        //We find the direction expressed in world coordinates by multipling with the inverse of the view matrix
        var rayDir = utils.multiplyMatrixVector(viewInv, rayEyeCoords);
        console.log("Ray direction "+rayDir);
        var normalisedRayDir = normaliseVector(rayDir);
        console.log("normalised ray dir "+normalisedRayDir);
        //The ray starts from the camera in world coordinates
        var rayStartPoint = [cx, cy, cz];
        
        //We iterate on all the objects in the scene to check for collisions
        for(i = 0; i < objectsInScene.length; i++){
            var hit = raySphereIntersection(rayStartPoint, normalisedRayDir, objectsInScene[i][0], objectsInScene[i][1]);
            if(hit){
                console.log("hit sphere number "+i);
                colours[i] = [Math.random(), Math.random(), Math.random(), 1];
            }
        }
}

async function init(){
    var path = window.location.pathname;
    var page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '');
    shaderDir = baseDir+"shaders/"; 
    
  canvas = document.getElementById("c");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    document.write("GL context not opened");
    return;
  }
  utils.resizeCanvasToDisplaySize(gl.canvas);
    
  await utils.loadFiles([shaderDir + 'vs_unlit.glsl', shaderDir + 'fs_unlit.glsl'], function (shaderText) {
      var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
      var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);

      program = utils.createProgram(gl, vertexShader, fragmentShader);
    });

    main();
}



window.onload = init;
window.addEventListener("mouseup", myOnMouseUp);
