var vertexShaderSource = `#version 300 es
in vec4 a_position;

void main() {
  gl_Position = a_position;
}`;

var fragmentShaderSource = `#version 300 es
precision mediump float;

uniform vec3 u_colour;
uniform float colour_choice;
uniform vec2 u_second_colour;

out vec4 outColor;

void main() {

  vec3 final_colour = u_colour * colour_choice + vec3(u_second_colour, 0.0) * (1.0 - colour_choice);
  outColor = vec4(final_colour, 1.0);
}`;