

export function createBuffer(gl: WebGLRenderingContext): WebGLBuffer {
  let leBuffer = gl.createBuffer();
  if (leBuffer == null) {
    throw new Error('Imposible to instanciate a GL buffer');
  }
  return leBuffer;
}

export function createProgram(gl: WebGLRenderingContext): WebGLProgram {
  let leProgram = gl.createProgram();
  if (leProgram == null) {
    throw new Error('Impossible to instanciate a GL program');
  }
  return leProgram;
}

export function getUniformLocation(gl: WebGLRenderingContext, prog: WebGLProgram, name: string): WebGLUniformLocation {
  let uniformLocation = gl.getUniformLocation(prog, name);
  if (uniformLocation === null) {
    throw new Error('Unable to get uniform: ' + name);
  }
  return uniformLocation;
}


export function makeShader(gl: WebGLRenderingContext, text: string, type: number): WebGLShader {
  let shader = gl.createShader(type);
  if (shader === null) {
    throw new Error('Cannot create a shader');
  }
  gl.shaderSource(shader, text);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      throw new Error("An error occurred compiling the shaders");
  }

  return shader;
}

export function createFrameBuffer(gl: WebGLRenderingContext): WebGLFramebuffer {
  let fb = gl.createFramebuffer();
  if (fb === null) {
    throw new Error('Cannot create a framebuffer');
  }
  return fb;
}


export function createTexture(gl: WebGLRenderingContext): WebGLTexture {
  let tex = gl.createTexture();
  if (tex === null) {
    throw new Error('Cannot create a texture');
  }
  return tex;
}

export function createRenderbuffer(gl: WebGLRenderingContext): WebGLRenderbuffer {
  let buf = gl.createRenderbuffer();
  if (buf === null) {
    throw new Error('Cannot create a renderbuffer');
  }
  return buf;
}