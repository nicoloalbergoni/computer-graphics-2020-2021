var vertexShaderSource = `#version 300 es

in vec3 a_position;
in vec3 a_normal;

uniform mat4 matrix; 
void main() {
  gl_Position = matrix * vec4(a_position,1.0);
}`;
var fragmentShaderSource = `#version 300 es

precision mediump float;

out vec4 outColor;

void main() {

  outColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;