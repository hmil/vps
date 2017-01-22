varying lowp vec2 vRadius;
varying lowp float vDepth;
varying lowp vec3 vNormal;
precision lowp float;

varying lowp vec3 vLightDir;
uniform lowp float uLightI;

#define M_PI 3.1415926535897932384626433832795

void main(void) {
  float intensity = sin((1.0 - length(vRadius)) * M_PI / 2.0) * 2.0;
  float power = (1.0 - sqrt(vDepth)) * 10.0 + 1.0;
  intensity = min(2.0, pow(intensity, power)) / 2.0;
  /*if (length(vRadius) < vDepth) {
    intensity = 1.0;
  } else {
    intensity = 0.0;
  }*/
  /*float radius = length(vRadius);
  float innerRadius = 1.0 - vDepth;
  float outerRadius = 1.0 + vDepth;
  float intensity = 0.0;
  float alpha = 1.0 / outerRadius;
  if (radius < innerRadius) {
    intensity = 2.0 * alpha - alpha * alpha;
  } else if (radius < outerRadius) {
    intensity = alpha;
  }*/

  intensity = 0.0;
  float radius = length(vRadius);
  if (radius < 0.5) {
    intensity = 1.0;
  } else if (radius < 0.55) {
    intensity = cos((radius - 0.5) * 10.0 * M_PI);
  }
  lowp float lightDist = length(vLightDir) * 4.0;
  lowp float illumination = uLightI * abs(dot(normalize(vLightDir), normalize(vNormal))) / lightDist / lightDist;

  gl_FragColor = vec4(illumination, illumination, illumination, intensity);
}