export class Shader {

	//STATIC PROPERTIES AND METHODS
	private static gl: WebGLRenderingContext;
	private static vert: WebGLShader;

	/**
	 * Loads a given shader
	 * @param src shader source code
	 * @param type shader type
	 * @returns shader handle
	 */
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

	//INSTANCE PROPERTIES AND METHODS

	private id: WebGLProgram;
	private frag: WebGLShader;
	private params: Map<string, Param>;

	constructor(fragSrc: string) {
		this.id = Shader.gl.createProgram();

		this.frag = Shader.load(fragSrc, Shader.gl.FRAGMENT_SHADER);

		Shader.gl.attachShader(this.id, Shader.vert);
		Shader.gl.attachShader(this.id, this.frag);
		Shader.gl.linkProgram(this.id);
		Shader.gl.validateProgram(this.id);

		if (!Shader.gl.getProgramParameter(this.id, Shader.gl.LINK_STATUS)) {
			throw "Error while linking the program: " + Shader.gl.getProgramInfoLog(this.id);
		}
	}
}

interface Param {

}
