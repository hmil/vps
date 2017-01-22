precision lowp float;

attribute vec3 aVertexPosition;

uniform mat4 uVMatrix;
uniform mat4 uMMatrix;
uniform mat4 uPMatrix;
uniform lowp vec3 uLightPos;

varying lowp vec2 vRadius;
varying lowp float vDepth;
varying lowp vec3 vNormal;
varying lowp vec3 vLightDir;

void main(void) {
  vec4 positionned = uMMatrix * vec4(aVertexPosition, 1.0);
  gl_Position = uPMatrix * uVMatrix * positionned;
  vRadius = vec2(aVertexPosition) * 100.0;
  vDepth = gl_Position.z;
  vNormal = vec3(uMMatrix * vec4(0.0, 0.0, 1.0, 1.0));
  vLightDir = uLightPos - vec3(positionned);
}