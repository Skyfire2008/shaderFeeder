namespace ShaderFeeder {

	export class FrameBuffer {

		private id: WebGLFramebuffer;
		public tex: Texture;

		constructor() {
			this.id = gl.createFramebuffer();
			this.tex = null;
		}

		public static unbind() {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}

		public updateTextureDim(width: number, height: number) {
			if (this.tex !== null) {
				gl.deleteTexture(this.tex.id);
			}

			this.tex = new Texture(null, width, height);
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.id);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tex.id, 0);
		}

		public bind() {
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.id);
		}
	}
}