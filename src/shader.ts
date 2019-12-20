namespace ShaderFeeder {

	export class Shader {

		//STATIC PROPERTIES AND METHODS
		private static gl: WebGLRenderingContext;
		private static vert: WebGLShader;
		private static quadBuf: WebGLBuffer;

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
				console.log("Error occurred while compiling shader: " + Shader.gl.getShaderInfoLog(id));
			}

			return id;
		}

		static init(gl: WebGLRenderingContext, vertSrc: string) {
			Shader.gl = gl;
			Shader.vert = Shader.load(vertSrc, gl.VERTEX_SHADER);

			//init the quad
			const points = [
				-1, -1,
				-1, 1,
				1, -1,
				1, 1
			];
			Shader.quadBuf = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, Shader.quadBuf);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
			gl.vertexAttribPointer(
				0,
				2,
				gl.FLOAT,
				false,
				0,
				0);
			gl.enableVertexAttribArray(0);
		}

		//INSTANCE PROPERTIES AND METHODS

		private id: WebGLProgram;
		private frag: WebGLShader;
		private params: Array<Param>;

		private texLoc: WebGLUniformLocation;

		constructor(fragSrc: string) {
			const gl = Shader.gl;
			this.id = gl.createProgram();

			this.frag = Shader.load(fragSrc, gl.FRAGMENT_SHADER);

			gl.attachShader(this.id, Shader.vert);
			gl.attachShader(this.id, this.frag);
			gl.bindAttribLocation(this.id, 0, "pos");
			gl.linkProgram(this.id);
			gl.validateProgram(this.id);

			this.texLoc = gl.getUniformLocation(this.id, "tex");

			if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
				console.error("Error while linking the program: " + gl.getProgramInfoLog(this.id));
			}
		}

		public use(): void {
			Shader.gl.useProgram(this.id);
		}

		public draw(): void {
			Shader.gl.drawArrays(Shader.gl.TRIANGLE_STRIP, 0, 4);
		}

		public bindTexture(tex: WebGLTexture): void {
			Shader.gl.activeTexture(Shader.gl.TEXTURE0);
			Shader.gl.bindTexture(Shader.gl.TEXTURE_2D, (<any>tex).id); //typescript bug
			Shader.gl.uniform1i(this.texLoc, 0);
		}
	}

	export interface Param {
		name: string;
		location: WebGLUniformLocation;
		dim: number;
		description: string;
		setter: (values: Array<number>) => void;
		defaultValues: Array<number>;
	}
}
