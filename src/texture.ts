namespace ShaderFeeder {

	export class Texture {

		public readonly id: WebGLTexture;
		public readonly width: number;
		public readonly height: number;

		constructor(img?: HTMLImageElement, width?: number, height?: number) {

			this.id = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this.id);

			if (img) {

				this.width = img.width;
				this.height = img.height;
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

			} else {

				this.width = width;
				this.height = height;
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

			}

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}
}
