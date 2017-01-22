import PostFX from './PostFX';
import Particle from './Particle';
import Light from './Light';
import Rect from './Rect';
import WebGLContext from './WebGLContext';
import { mat4, vec3 } from 'gl-matrix';

const N_PARTICLES = 500;

// TODO: implement depth of field bluring

export interface SceneParams {
  coords: vec3;
  camera: vec3;
  lightIntensity: number;
}

export interface RenderingData {
  lights: Light[];
  projection: mat4;
  view: mat4;
  lightIntensity: number;
}

export default class Scene {
  private context: RenderingData = {
    lights: [],
    projection: mat4.create(),
    view: mat4.create(),
    lightIntensity: 0.0
  };

  private wall: Rect;
  private particles: Particle[] = [];
  private afterFX: PostFX;
  private totalTime = 0;

  constructor() {
    let gl = WebGLContext.get();
    this.initScene(gl);
    this.initFX();

    this.createParticles();
    this.createWall();
  }

  private createParticles() {
    for (let i = 0 ; i < N_PARTICLES ; i++) {
      let particle = new Particle();
      let initialPos = vec3.create();
      vec3.set(initialPos, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1 + 1);
      particle.initialTime = vec3.len(initialPos);
      mat4.translate(particle.initialTransform, particle.initialTransform, initialPos);
      mat4.rotateX(particle.initialTransform, particle.initialTransform, Math.random());
      mat4.rotateY(particle.initialTransform, particle.initialTransform, Math.random());
      let scale = Math.random() + 1.75;
      mat4.scale(particle.initialTransform, particle.initialTransform, [scale, scale, scale]);
      this.particles.push(particle);
    }
  }

  private createWall() {
    this.wall = new Rect();
    this.wall.scale(4, 4, 1);
    this.wall.translate(0, 0, -3);
  }

  public update(dt: number) {
    this.totalTime += dt;
    for (let i = 0 ; i < N_PARTICLES ; i++) {
      let particle = this.particles[i];
      let rot1 = Math.PI / 50000 * (this.totalTime + particle.initialTime) + 4.7 * particle.initialTime;
      let rot2 = Math.PI / 12373 * (this.totalTime + particle.initialTime) + 3.5 * particle.initialTime;
      let rot3 = Math.PI / 59829 * (this.totalTime + particle.initialTime) + 2.1 * particle.initialTime;
      mat4.identity(particle.modelMatrix);
      mat4.translate(particle.modelMatrix, particle.modelMatrix, [
        Math.sin(rot1) * 0.5 + Math.sin(rot2) * 0.2 + Math.sin(rot3) * 0.1,
        Math.cos(rot1) * 0.5 + Math.cos(rot2) * 0.2 + Math.cos(rot3) * 0.1,
        Math.cos(rot1) * 0.5 + Math.sin(rot2) * 0.2 + Math.sin(rot3) * 0.1
      ])
      /*mat4.rotateY(particle.modelMatrix, particle.modelMatrix, Math.PI / 55000 * (this.totalTime + particle.initialTime));
      mat4.translate(particle.modelMatrix, particle.modelMatrix, [0.2, 0.3, 0.1]);
      mat4.rotateX(particle.modelMatrix, particle.modelMatrix, Math.PI / 29000 * (this.totalTime + particle.initialTime));
      mat4.translate(particle.modelMatrix, particle.modelMatrix, [-0.5, -0.4, 0.5]);
      mat4.rotateX(particle.modelMatrix, particle.modelMatrix, Math.PI / 300000 * (this.totalTime + particle.initialTime));*/
      mat4.mul(particle.modelMatrix, particle.modelMatrix, particle.initialTransform);
    }
  }

  public draw(params: SceneParams) {
    this.context.lightIntensity = params.lightIntensity;

    let gl = WebGLContext.get();
    let vector = vec3.create();

    // this.afterFX.bind();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.identity(this.context.view);
    mat4.translate(this.context.view, this.context.view, params.camera);

    vec3.set(vector, 0.404, 3.3, -2.794);
    this.context.lights[0].setPosition(vector);
    this.wall.render(this.context);

    this.context.lights[0].setPosition(params.coords);
    for (let i = 0 ; i < N_PARTICLES ; i++) {
      this.particles[i].render(this.context);
    }

    /*gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.afterFX.render();*/
  }

  private initFX() {
    this.afterFX = new PostFX();
  }

  private initScene(gl: WebGLRenderingContext) {
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // Enable depth testing
    gl.disable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LESS);
    // Clear the color as well as the depth buffer.

    mat4.perspective(this.context.projection, 45, 1024.0/1024.0, 0.1, 100.0);

    this.context.lights.push(new Light());
  }
}
