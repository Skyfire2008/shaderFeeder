namespace ShaderFeeder {

	export class Texture {

		private static gl: WebGLRenderingContext;

		static init(gl: WebGLRenderingContext) {
			Texture.gl = gl;
		}

		public readonly id: WebGLTexture;
		public readonly width: number;
		public readonly height: number;

		constructor(img: HTMLImageElement) {
			const gl = Texture.gl;

			this.width = img.width;
			this.height = img.height;

			this.id = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this.id);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}
}
