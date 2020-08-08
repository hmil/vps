precision lowp float;

uniform sampler2D uDepth;
uniform sampler2D uColor;

varying lowp vec2 vTextureCoord;

const lowp float step = 1.0/1024.0;

vec3 neighborContrib(int x, int y) {
  float dx = float(x) * step;
  float dy = float(y) * step;
  vec2 samplePoint = vec2(vTextureCoord.s + dx, vTextureCoord.t + dy);
  vec3 color = vec3(texture2D(uColor, samplePoint));
  float h = 1.0 - texture2D(uDepth, samplePoint).r;

  float b1 = length(vec2(x, y));
  float b = 1.0/h;
  float h1 = b1 / b * h;

  return color ;
}

void main(void) {
  /*vec3 left = vec3(texture2D(uSampler, vec2(vTextureCoord.s - 0.001, vTextureCoord.t)));
  vec3 right = vec3(texture2D(uSampler, vec2(vTextureCoord.s + 0.001, vTextureCoord.t)));
  vec3 center = vec3(texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)));

  left.x = 0.0;
  left.z *= 2.0;
  // left.y *= 0.5;
  // right.y *= 0.5;
  right.z = 0.0;
  right.x *= 2.0;
  center.y *= 3.0;
  center.x *= 2.0;
  center.z *= 2.0;

  gl_FragColor = vec4( 0.5 * left + 0.5 * right, 1.0);*/
  //float depth = texture2D(uDepth, vec2(vTextureCoord.s, vTextureCoord.t)).r;
  float depth = 1.0;
  gl_FragColor = vec4(depth * vec3(texture2D(uColor, vec2(vTextureCoord.s, vTextureCoord.t))), 1.0);
  //gl_FragColor = vec4(depth, depth, depth, 1.0);

  vec3 color = vec3(0.0, 0.0, 0.0);
  for (int i = -0 ; i <= 0 ; i++) {
    for (int j = -0 ; j <= 0 ; j++) {
      color += neighborContrib(i, j);
    }
  }
  gl_FragColor = vec4(color, 1.0);
}

