var vertexShaderSource = `#version 300 es

in vec3 a_position;
in vec3 a_normal;

out vec3 fs_norm;

uniform mat4 matrix; 
void main() {
  fs_norm = a_normal;
  gl_Position = matrix * vec4(a_position,1.0);
}`;
var fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 fs_norm;
out vec4 outColor;

void main() {
  vec3 norm = normalize(fs_norm) * 0.5 + 0.5;
  outColor = vec4(norm, 1.0);
}`;