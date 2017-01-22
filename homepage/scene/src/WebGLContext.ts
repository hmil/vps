
export default class WebGLContext {

  private static gl: WebGLRenderingContext;

  public static init(): void {
    let canvas = document.getElementById("glcanvas") as HTMLCanvasElement;

    // Try to grab the standard context. If it fails, fallback to experimental.
    let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    // If we don't have a GL context, give up now
    if (!gl) {
      throw new Error("Unable to initialize WebGL. Your browser may not support it.");
    }
    WebGLContext.gl = gl;
  }

  public static get(): WebGLRenderingContext {
    if (WebGLContext.gl === null) {
      throw new Error('The rendeing context is not yet available');
    }
    return WebGLContext.gl;
  }
}