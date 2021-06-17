#version 300 es

in vec3 inPosition;

uniform mat4 matrix; 

void main() {
  gl_Position = matrix * vec4(inPosition, 1.0);
}