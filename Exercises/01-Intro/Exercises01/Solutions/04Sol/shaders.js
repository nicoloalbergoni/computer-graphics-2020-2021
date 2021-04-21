var vertexShaderSource = `#version 300 es
in vec4 a_position;

void main() {
  gl_Position = a_position;
}`;

var fragmentShaderSource = `#version 300 es
precision mediump float;

uniform float radians_over_time;

out vec4 outColor;

void main() {
  float value = sin(radians_over_time) * 0.5 +0.5;
  outColor = vec4(value, 0.0, 0.0, 1.0);
}`;