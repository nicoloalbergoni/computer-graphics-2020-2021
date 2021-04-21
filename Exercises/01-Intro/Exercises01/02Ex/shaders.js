var vertexShaderSource = `#version 300 es
in vec4 a_position;

void main() {
  gl_Position = a_position;
}`;

var fragmentShaderSource = `#version 300 es
precision mediump float;
uniform vec3 diff_colour;
out vec4 outColor;

void main() {
  outColor = vec4(diff_colour, 1.0);
}`;