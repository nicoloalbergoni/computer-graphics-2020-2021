var vertexShaderSource = `#version 300 es

in vec3 a_position;
in vec3 a_normal;
out vec3 fs_normal;

uniform mat4 matrix; 
void main() {
  fs_normal = a_normal;
  gl_Position = matrix * vec4(a_position,1.0);
}`;
var fragmentShaderSource = `#version 300 es

precision mediump float;

out vec4 outColor;
in vec3 fs_normal;

void main() {
  vec3 norm_fs_normal = abs(normalize(fs_normal));
  outColor = vec4(norm_fs_normal.x, norm_fs_normal.y, norm_fs_normal.z, 1.0);
}`;