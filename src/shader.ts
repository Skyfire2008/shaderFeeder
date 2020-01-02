namespace ShaderFeeder {

	export class Shader {

		//STATIC PROPERTIES AND METHODS
		private static vert: WebGLShader;
		private static quadBuf: WebGLBuffer;

		/**
		 * Loads a given shader
		 * @param src shader source code
		 * @param type shader type
		 * @returns shader handle
		 */
		static load(src: string, type: number): WebGLShader {
			const id = gl.createShader(type);
			gl.shaderSource(id, src);
			gl.compileShader(id);

			//check, that the shader was successfully compiled
			if (!gl.getShaderParameter(id, gl.COMPILE_STATUS)) {
				console.log("Error occurred while compiling shader: " + gl.getShaderInfoLog(id));
			}

			return id;
		}

		static init(vertSrc: string) {
			Shader.vert = Shader.load(vertSrc, gl.VERTEX_SHADER);

			//init the quad
			const points = [
				-1, 1,
				-1, -1,
				1, 1,
				1, -1
			];

			Shader.quadBuf = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, Shader.quadBuf);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
			gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(0);
		}

		//INSTANCE PROPERTIES AND METHODS

		private id: WebGLProgram;
		private frag: WebGLShader;
		private params: Array<Param>;

		private texLoc: WebGLUniformLocation;
		private imgSizeLoc: WebGLUniformLocation = null;
		private flipYLoc: WebGLUniformLocation;

		constructor(fragSrc: string) {
			this.id = gl.createProgram();

			this.frag = Shader.load(fragSrc, gl.FRAGMENT_SHADER);

			gl.attachShader(this.id, Shader.vert);
			gl.attachShader(this.id, this.frag);
			gl.bindAttribLocation(this.id, 0, "pos");
			gl.linkProgram(this.id);
			gl.validateProgram(this.id);

			this.use();
			this.flipYLoc = gl.getUniformLocation(this.id, "flipY");

			this.texLoc = gl.getUniformLocation(this.id, "tex");

			if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
				console.error("Error while linking the program: " + gl.getProgramInfoLog(this.id));
			}

			//get the config
			this.params = [];
			const reg = /.*\/\*@config(.+)\*\//s;
			const result = reg.exec(fragSrc);
			if (result !== null) {

				//TODO: this is bad...
				const config = <ConfigDef>JSON.parse(result[1]);
				//for every parameter name...
				for (const name in config.params) {
					const loc = gl.getUniformLocation(this.id, name);
					if (loc === null) {
						console.error(`No uniform ${name} found!`);
						continue;
					}

					const paramDef = config.params[name];
					switch (paramDef.input) {
						case InputEnum.enum: {
							paramDef.dim = 1;
							paramDef.type = TypeEnum.int;
							break;
						}
						case InputEnum.imgSize: {
							if (this.imgSizeLoc !== null) {
								console.warn("Multiple parameters setting image size used!");
							}
							this.imgSizeLoc = gl.getUniformLocation(this.id, name);
							continue;
						}
						case InputEnum.angle: {
							paramDef.dim = 1;
							paramDef.type = TypeEnum.float;
							break;
						}
						case InputEnum.bool: {
							paramDef.dim = 1;
							paramDef.type = TypeEnum.int;
							break;
						}
					}

					this.params.push({
						name: name,
						description: paramDef.description,
						dim: paramDef.dim,
						inputType: paramDef.input,
						setter: makeParamSetter(gl, loc, paramDef.dim, paramDef.type),
						values: makeDefaultParamValues(paramDef.dim),
						enumValues: paramDef.enumValues
					});
				}
			}
		}

		public setFlipY(value: boolean) {
			gl.uniform1i(this.flipYLoc, value ? 1 : 0);
		}

		public use(): void {
			gl.useProgram(this.id);
		}

		public draw(): void {
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}

		public bindTexture(tex: Texture): void {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, tex.id);
			gl.uniform1i(this.texLoc, 0);

			if (this.imgSizeLoc !== null) {
				gl.uniform2f(this.imgSizeLoc, tex.width, tex.height);
			}
		}
	}

	export interface Param {
		name: string;
		dim: number;
		inputType: InputEnum;
		description: string;
		setter: (value: number | Array<number>) => void;
		values: number | Array<number>;
		enumValues?: Array<string>;
	}

	const enum InputEnum {
		default = "default",
		enum = "enum",
		imgSize = "imgSize",
		angle = "angle",
		bool = "bool"
	}

	export const enum TypeEnum {
		float = "float",
		int = "int"
	}

	interface ParamDef {
		input: InputEnum;
		description?: string;
		type?: TypeEnum;
		dim?: number;
		enumValues?: Array<string>;
	}

	interface ConfigDef {
		version: number;
		params: Params;
	}

	interface Params {
		[index: string]: ParamDef;
	}
}
