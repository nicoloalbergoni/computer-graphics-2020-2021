var vertexShaderSource = `#version 300 es
in vec4 a_position;

void main() {
  gl_Position = a_position;
}`;

var fragmentShaderSource = `#version 300 es
precision mediump float;

out vec4 outColor;

void main() {
  outColor = vec4(0.0,0.0,1.0, 1.0);
}`;