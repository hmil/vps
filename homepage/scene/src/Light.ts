import { vec3 } from 'gl-matrix';


export default class Light {

  private pos: vec3 = vec3.create();

  public getPosition(): vec3 {
    return this.pos;
  }

  public setPosition(position: vec3): void {
    vec3.copy(this.pos, position);
  }
}