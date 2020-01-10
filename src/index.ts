namespace ShaderFeeder {

	export var gl: WebGLRenderingContext;

	interface NamedShader {
		shader: Shader;
		name: string;
	}

	interface NamedImage {
		image: HTMLImageElement;
		texture: Texture;
		name: string;
	}

	export class AppViewModel {
		public shaders: KnockoutObservableArray<NamedShader>;
		public selectedShader: KnockoutObservable<NamedShader>;
		public images: KnockoutObservableArray<NamedImage>;
		public selectedImage: KnockoutObservable<NamedImage>;
		public keepRedrawing: KnockoutObservable<boolean>;
		public redrawOnParamChange: KnockoutObservable<boolean>;
		public scale: KnockoutObservable<number>;

		public canvas: HTMLCanvasElement;

		private quadShader: Shader;
		private frameBuffers: Array<FrameBuffer>;
		private currentFb = 0;

		private frameNum: number = 0;

		private reset() {
			this.selectedImage.notifySubscribers(this.selectedImage());
		}

		private rescale() {
			const width = Math.round(this.selectedImage().image.width * this.scale());
			const height = Math.round(this.selectedImage().image.height * this.scale());
			this.canvas.width = width;
			this.canvas.height = height;
			gl.viewport(0, 0, width, height);
		}

		constructor() {
			this.keepRedrawing = ko.observable(false);
			this.redrawOnParamChange = ko.observable(false);
			this.shaders = ko.observableArray();

			this.scale = ko.observable(1).extend({ numeric: null });
			this.scale.subscribe((newValue) => {
				this.rescale();
			});

			this.selectedShader = ko.observable();
			this.selectedShader.subscribe(({ shader, name }) => {
				shader.use();
			});

			this.images = ko.observableArray();
			this.selectedImage = ko.observable();
			this.selectedImage.subscribe((newImage) => {
				this.rescale();

				this.frameBuffers[0].updateTextureDim(newImage.image.width, newImage.image.height);
				this.frameBuffers[1].updateTextureDim(newImage.image.width, newImage.image.height);

				//draw texture into framebuffer 0
				gl.viewport(0, 0, newImage.image.width, newImage.image.width);
				this.frameBuffers[0].bind();
				this.quadShader.use();
				this.quadShader.setFlipY(true);
				this.quadShader.bindTexture(newImage.texture);
				this.quadShader.draw();
				this.quadShader.setFlipY(false);
				this.currentFb = 0;

				this.selectedShader().shader.use();

				this.redraw();
			});

			//get webGL context
			this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
			gl = this.canvas.getContext("webgl");
			if (!gl) {
				console.error("Could not create webGL rendering context");
			}
			this.frameBuffers = [];
			for (let i = 0; i < 2; i++) {
				this.frameBuffers.push(new FrameBuffer());
			}

			//load vertex shader and init Shader object
			fetchFile("shaders/quad.vert").then((value) => {

				//load the passthrough shader
				fetchFile("shaders/quad.frag").then((shaderSrc) => {
					this.quadShader = new Shader(shaderSrc);
				});

				Shader.init(value);

				//load all shaders
				const shaderNames = ["swizzle", "shift", "emboss", "replaceWithBrighter", "chromaticAberration"];
				for (const name of shaderNames) {
					fetchFile(`shaders/${name}.frag`).then((shaderSrc) => {
						this.shaders.push({ name, shader: new Shader(shaderSrc) });
					});
				}
			});
		}

		public continuousRedrawing(): void {
			this.keepRedrawing(!this.keepRedrawing());

			const onEnterFrame = () => {
				this.frameNum++;
				this.redraw();
				if (this.keepRedrawing()) {
					window.requestAnimationFrame(onEnterFrame);
				}
			}

			if (this.keepRedrawing()) {
				window.requestAnimationFrame(onEnterFrame);
			}
		}

		public redraw(): void {

			//draw into framebuffer
			gl.viewport(0, 0, this.selectedImage().texture.width, this.selectedImage().texture.height);
			const selectedShader = this.selectedShader().shader;
			selectedShader.use();
			selectedShader.bindTexture(this.frameBuffers[this.currentFb].tex);
			this.frameBuffers[1 - this.currentFb].bind();
			selectedShader.draw();

			//draw into display
			gl.viewport(0, 0, this.selectedImage().texture.width * this.scale(), this.selectedImage().texture.height * this.scale());
			FrameBuffer.unbind();
			this.quadShader.use();
			this.quadShader.bindTexture(this.frameBuffers[1 - this.currentFb].tex);
			this.quadShader.draw();

			//swap framebuffers
			this.currentFb = 1 - this.currentFb;

			selectedShader.use();
		}

		public uploadFile(file: File) {
			const fr = new FileReader();
			fr.onload = (e: any) => { //ProgressEvent is not generic >:(
				const img = new Image();
				img.onload = (e: Event) => {
					this.images.push({
						name: file.name,
						image: img,
						texture: new Texture(img)
					});

				};

				img.src = <string>e.target.result;
			};

			fr.readAsDataURL(file);
		}
	}

	window.addEventListener("load", () => {
		const viewModel = new AppViewModel();
		ko.applyBindings(viewModel);
	});
}
