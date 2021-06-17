#version 300 es

precision mediump float;

in vec3 position;
out vec4 outColor;

void main() {
  outColor = vec4(position.x, position.y, position.z,1.0);
}