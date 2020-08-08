precision lowp float;

attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform lowp vec3 uLightPos;

varying lowp vec4 vColor;
varying lowp vec3 vLightDir;

void main(void) {
  vec4 myPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
  vColor = aVertexColor;

  // Remove the x-component for light calculation
  vec3 lightPos = uLightPos;
  lightPos.x = 0.0;
  vec3 vertexLight = aVertexPosition;
  vertexLight.x = 0.0;

  vLightDir = lightPos - vertexLight;
  gl_Position = uPMatrix * myPosition;
}