import WebGLContext from './WebGLContext';
import { vec3 } from 'gl-matrix';
import { default as Scene, SceneParams } from './Scene';
// import { GUI } from 'dat-gui';

let scene: Scene;
let xCtrl: HTMLInputElement;
let yCtrl: HTMLInputElement;
let zCtrl: HTMLInputElement;
let params: SceneParams = {
  coords: vec3.create(),
  camera: vec3.create(),
  lightIntensity: 0
};
let lastTime = -1;


class Controls {
  public x = 0.0;
  public y = 0.0;
  public z = 0.51;

  public cx = 0.0;
  public cy = 0.073;
  public cz = -2.68;

  public lightIntensity = 0.1;
}
let controls = new Controls();

export function start() {
  WebGLContext.init();
  //initGUI();

  xCtrl = document.getElementById('x') as HTMLInputElement;
  yCtrl = document.getElementById('y') as HTMLInputElement;
  zCtrl = document.getElementById('z') as HTMLInputElement;

  scene = new Scene();
  window.requestAnimationFrame(update);

  let n_interval = 0;
  let interval = window.setInterval(function() {
    n_interval++;
    //let coeff = n_interval * 0.5;
    controls.lightIntensity = n_interval % 3 === 0 ? 1.0 : Math.min(n_interval / 45, 1.0);//coeff - Math.floor(coeff);
    if (n_interval === 45) {
      controls.lightIntensity = 1.0;
      window.clearInterval(interval);
    }
  }, 100);
}

/*function initGUI() {
  let gui = new GUI();
  let light = gui.addFolder('Light');
  light.add(controls, 'x', -5, 5);
  light.add(controls, 'y', -5, 5);
  light.add(controls, 'z', -5, 5);
  let camera = gui.addFolder('Camera');
  camera.add(controls, 'cx', -5, 5);
  camera.add(controls, 'cy', -5, 5);
  camera.add(controls, 'cz', -5, 5);
}*/

export function update(time: number) {
  if (lastTime !== -1) {
    scene.update(time - lastTime);
  }
  lastTime = time;
  params.coords[0] = controls.x;
  params.coords[1] = controls.y;
  params.coords[2] = controls.z;
  params.camera[0] = controls.cx;
  params.camera[1] = controls.cy;
  params.camera[2] = controls.cz;
  params.lightIntensity = controls.lightIntensity;
  scene.draw(params);
  window.requestAnimationFrame(update);
}