var vertexShaderSource = `#version 300 es
in vec4 a_position;

out vec2 fs_pos;

void main() {
  fs_pos = a_position.xy;
  gl_Position = a_position;
}`;

var fragmentShaderSource = `#version 300 es
precision mediump float;

in vec2 fs_pos;

out vec4 outColor;

void main() {
  outColor = vec4(fs_pos.x, fs_pos.y, 0.0, 1.0);
}`;