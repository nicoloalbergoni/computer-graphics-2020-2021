#version 300 es

precision mediump float;

uniform vec4 colour;
out vec4 outColor;

void main() {
  outColor = colour;
}