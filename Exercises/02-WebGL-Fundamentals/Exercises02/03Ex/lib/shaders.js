var vertexShaderSource = `#version 300 es
in vec4 a_position;
in vec3 a_colour;

out vec3 fs_colour;

void main() {
  fs_colour = a_colour;
  gl_Position = a_position;
}`;

var fragmentShaderSource = `#version 300 es
precision mediump float;

in vec3 fs_colour;

out vec4 outColor;

void main() {
  outColor = vec4(fs_colour, 1.0);
}`;