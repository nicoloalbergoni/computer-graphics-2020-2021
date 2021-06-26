#version 300 es

in vec3 inPosition;
out vec3 position;

uniform mat4 matrix; 

void main() {
  position = inPosition;
  gl_Position = matrix * vec4(inPosition, 1.0);
}