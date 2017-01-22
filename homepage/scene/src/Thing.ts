import { mat4 } from 'gl-matrix';


// It's 11pm so I cannot come up with a better name
export default class Thing {

  public modelMatrix: mat4 = mat4.create();

  public scale(sx: number, sy: number, sz: number): void {
    mat4.scale(this.modelMatrix, this.modelMatrix, [sx, sy, sz]);
  }

  public translate(dx: number, dy: number, dz: number): void {
    mat4.translate(this.modelMatrix, this.modelMatrix, [dx, dy, dz]);
  }

  public transform(trnsf: mat4): void {
    mat4.mul(this.modelMatrix, this.modelMatrix, trnsf);
  }
}