import Thing from './Thing';
import { RenderingData } from './Scene';
import { mat4, vec3 } from 'gl-matrix';
import { createBuffer, createProgram, getUniformLocation, makeShader } from './helpers';
import WebGLContext from './WebGLContext';

let wall = require('./shaders').wall;

let tmpMatrix = mat4.create();
let tmpVec3 = vec3.create();

export default class Rect extends Thing {

  private static vertexBuffer: WebGLBuffer;
  private static colorBuffer: WebGLBuffer;
  private static shaderProgram: WebGLProgram;
  private static vertexPositionAttribute: number;


  constructor() {
    super();
    if (Rect.vertexBuffer == null || Rect.colorBuffer == null) {
      this.init();
    }
  }

  private init() {
    let gl = WebGLContext.get();

    // Initialize the shaders

    let fragmentShader = makeShader(gl, wall.vert, gl.VERTEX_SHADER);
    let vertexShader = makeShader(gl, wall.frag, gl.FRAGMENT_SHADER);

    // Create the shader program

    Rect.shaderProgram = createProgram(gl);
    gl.attachShader(Rect.shaderProgram, vertexShader);
    gl.attachShader(Rect.shaderProgram, fragmentShader);
    gl.linkProgram(Rect.shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(Rect.shaderProgram, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(Rect.shaderProgram));
      throw new Error('Unable to initialize the shader program');
    }

    gl.useProgram(Rect.shaderProgram);

    Rect.vertexPositionAttribute = gl.getAttribLocation(Rect.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(Rect.vertexPositionAttribute);
    let vertexColorAttribute = gl.getAttribLocation(Rect.shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(vertexColorAttribute);


    // Initialize the buffers

    let vertices = [
      1.0,  1.0,  0.0,
      -1.0, 1.0,  0.0,
      1.0,  -1.0, 0.0,
      -1.0, -1.0, 0.0
    ];

    Rect.vertexBuffer = createBuffer(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, Rect.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var colors = [
      0.3,   0.0,  1.0,  1.0,    // bright blue
      0.3,   0.0,  1.0,  1.0,    // bright blue
      0.3,   0.0,  1.0,  1.0,    // bright blue
      0.3,   0.0,  1.0,  1.0,    // bright blue
    ];

    Rect.colorBuffer = createBuffer(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, Rect.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
  }


  public render(context: RenderingData) {
    let gl = WebGLContext.get();

    gl.useProgram(Rect.shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, Rect.vertexBuffer);
    gl.vertexAttribPointer(Rect.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    let pUniform = getUniformLocation(gl, Rect.shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, context.projection);
    let mvUniform = getUniformLocation(gl, Rect.shaderProgram, "uMVMatrix");
    mat4.mul(tmpMatrix, context.view, this.modelMatrix);
    gl.uniformMatrix4fv(mvUniform, false, tmpMatrix);
    let lpUniform = getUniformLocation(gl, Rect.shaderProgram, "uLightPos");

    mat4.invert(tmpMatrix, this.modelMatrix);
    vec3.transformMat4(tmpVec3, context.lights[0].getPosition(), tmpMatrix);
    gl.uniform3fv(lpUniform, tmpVec3);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}