precision lowp float;

attribute lowp vec3 aVertexPosition;

varying lowp vec2 vTextureCoord;

uniform lowp mat4 uVMatrix;

void main(void) {
  gl_Position = uVMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoord = vec2(aVertexPosition.x, aVertexPosition.y);
}