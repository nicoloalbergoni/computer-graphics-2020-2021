var vertexShaderSource = `#version 300 es

in vec3 a_position;
in vec3 a_normal;

out vec3 fs_norm;

uniform mat4 matrix; 
//We need to transform the normals with the position
//We will see in a future lesson why and how to do it
uniform mat4 nMatrix; 
void main() {
  fs_norm = mat3(nMatrix) * a_normal;
  gl_Position = matrix * vec4(a_position,1.0);
}`;
var fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 fs_norm;
uniform vec3 mDiffColor; //material diffuse color 
uniform vec3 lightDirection; // directional light direction vec
uniform vec3 lightColor; //directional light color 
out vec4 outColor;

void main() {
  outColor = vec4(0.0,0.0,1.0, 1.0);
}`;