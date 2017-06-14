import { mat4 } from 'gl-matrix';
import Thing from './Thing';
import { RenderingData } from './Scene';
import WebGLContext from './WebGLContext';
import { createBuffer, createProgram, getUniformLocation, makeShader } from './helpers';

let particle = require('./shaders').particle;

const SCALE = 0.1;

export default class Particle extends Thing {

  private static vertexBuffer: WebGLBuffer;
  private static shaderProgram: WebGLProgram;
  private static vertexPositionAttribute: number;
  private static pUniform: WebGLUniformLocation;
  private static mUniform: WebGLUniformLocation;
  private static vUniform: WebGLUniformLocation;
  public initialTime: number;
  public initialTransform: mat4 = mat4.create();

  constructor() {
    super();
    if (Particle.vertexBuffer == null) {
      this.init();
    }
  }

  private init() {
    let gl = WebGLContext.get();

    // Initialize the shaders

    let fragmentShader = makeShader(gl, particle.vert, gl.VERTEX_SHADER);
    let vertexShader = makeShader(gl, particle.frag, gl.FRAGMENT_SHADER);

    // Create the shader program

    Particle.shaderProgram = createProgram(gl);
    gl.attachShader(Particle.shaderProgram, vertexShader);
    gl.attachShader(Particle.shaderProgram, fragmentShader);
    gl.linkProgram(Particle.shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(Particle.shaderProgram, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(Particle.shaderProgram));
      throw new Error('Unable to initialize the shader program');
    }

    gl.useProgram(Particle.shaderProgram);

    Particle.vertexPositionAttribute = gl.getAttribLocation(Particle.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(Particle.vertexPositionAttribute);
    Particle.pUniform = getUniformLocation(gl, Particle.shaderProgram, "uPMatrix");
    Particle.mUniform = getUniformLocation(gl, Particle.shaderProgram, "uMMatrix");
    Particle.vUniform = getUniformLocation(gl, Particle.shaderProgram, "uVMatrix");

    // Initialize the buffers

    let vertices = [0.0,    0.0,    0.0];
    for (let i = 0 ; i < 6 ; i++) {
      vertices.push(Math.cos(i * 2 * Math.PI / 5) * 0.015 * SCALE);
      vertices.push(Math.sin(i * 2 * Math.PI / 5) * 0.01 * SCALE);
      vertices.push(Math.sin(i * Math.PI / 5) * 0.008 * SCALE);
    }
    Particle.vertexBuffer = createBuffer(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, Particle.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  }

  public render(context: RenderingData): void {
    let gl = WebGLContext.get();

    gl.useProgram(Particle.shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, Particle.vertexBuffer);
    gl.vertexAttribPointer(Particle.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);


    gl.uniformMatrix4fv(Particle.pUniform, false, context.projection);
    gl.uniformMatrix4fv(Particle.vUniform, false, context.view);
    gl.uniformMatrix4fv(Particle.mUniform, false, this.modelMatrix);

    let lpUniform = getUniformLocation(gl, Particle.shaderProgram, "uLightPos");
    gl.uniform3fv(lpUniform, context.lights[0].getPosition());
    let lightIUniform = getUniformLocation(gl, Particle.shaderProgram, "uLightI");
    gl.uniform1f(lightIUniform, context.lightIntensity);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 7);
  }
}