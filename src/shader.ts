export class Shader {

	private static gl: WebGLRenderingContext;
	private static vert: WebGLShader;

	static load(src: string, type: number): WebGLShader {
		const id = Shader.gl.createShader(type);
		Shader.gl.shaderSource(id, src);
		Shader.gl.compileShader(id);

		//check, that the shader was successfully compiled
		if (!Shader.gl.getShaderParameter(id, Shader.gl.COMPILE_STATUS)) {
			throw "Error occurred while compiling shader: " + Shader.gl.getShaderInfoLog(id);
		}

		return id;
	}

	static init(gl: WebGLRenderingContext, vertSrc: string) {
		Shader.gl = gl;
		Shader.vert = Shader.load(vertSrc, gl.VERTEX_SHADER);
	}

	constructor(fragSrc: string) {

	}
}