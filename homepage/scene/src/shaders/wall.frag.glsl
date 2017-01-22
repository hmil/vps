precision lowp float;

varying lowp vec4 vColor;
varying lowp vec3 vLightDir;

const lowp vec3 normal = vec3(0, 0, 1);

void main(void) {
  lowp float lightLength = length(vLightDir) * 3.0 + 1.0 ;
  lowp float illumination = dot(normalize(vLightDir), normal) / lightLength / lightLength;
  gl_FragColor = vec4(vec3(vColor) * illumination, 1.0);
}