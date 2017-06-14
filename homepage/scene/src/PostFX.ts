import { mat4 } from 'gl-matrix';
import WebGLContext from './WebGLContext';
import {
  createBuffer,
  createFrameBuffer,
  createProgram,
  createTexture,
  getUniformLocation,
  makeShader
} from './helpers';
let postFX = require('./shaders');

export default class PostFX {

  private static RES_X = 1024;
  private static RES_Y = 1024;

  private fb: WebGLFramebuffer;
  private color_tex: WebGLTexture;
  private depth_tex: WebGLTexture;
  private shaderProgram: WebGLProgram;
  private vertexBuffer: WebGLBuffer;
  private viewMatrix: mat4;
  private vUniform: WebGLUniformLocation;

  private vertexPositionAttribute: number;
  private colorUniform: WebGLUniformLocation;
  private depthUniform: WebGLUniformLocation;

  constructor() {
    this.init();
  }

  private init() {

    // Initializing the framebuffer stuff
    let gl = WebGLContext.get();
    gl.getExtension('WEBGL_depth_texture');
    this.fb = createFrameBuffer(gl);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
    this.depth_tex = createTexture(gl);
    gl.bindTexture(gl.TEXTURE_2D, this.depth_tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, PostFX.RES_X, PostFX.RES_Y, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);

    this.color_tex = createTexture(gl);
    gl.bindTexture(gl.TEXTURE_2D, this.color_tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PostFX.RES_X, PostFX.RES_Y, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.color_tex, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depth_tex, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // Initializing the shader program
    let fragmentShader = makeShader(gl, postFX.vert, gl.VERTEX_SHADER);
    let vertexShader = makeShader(gl, postFX.frag, gl.FRAGMENT_SHADER);
    this.shaderProgram = createProgram(gl);
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);

    this.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    this.colorUniform = getUniformLocation(gl, this.shaderProgram, "uColor");
    this.depthUniform = getUniformLocation(gl, this.shaderProgram, "uDepth");
    this.vUniform = getUniformLocation(gl, this.shaderProgram, "uVMatrix");

    // Initializes the vertices

    let vertices = [
      0,    0,    0.0,
      1,    0,    0.0,
      0,    1,    0.0,
      1,    1,    0.0
    ];
    this.vertexBuffer = createBuffer(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    this.viewMatrix = mat4.create();
    mat4.scale(this.viewMatrix, this.viewMatrix, [2, 2, 1]);
    mat4.translate(this.viewMatrix, this.viewMatrix, [-0.5, -0.5, 0]);
  }

  public bind() {
    let gl = WebGLContext.get();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
  }

  public render() {
    let gl = WebGLContext.get();

    gl.useProgram(this.shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.depth_tex);
    gl.uniform1i(this.depthUniform, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.color_tex);
    gl.uniform1i(this.colorUniform, 1);

    gl.uniformMatrix4fv(this.vUniform, false, this.viewMatrix);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}