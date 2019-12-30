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
		public canvas: HTMLCanvasElement;

		private quadShader: Shader;
		private frameBuffers: Array<FrameBuffer>;
		private currentFb = 0;

		private keepRedrawing: KnockoutObservable<boolean>;
		public redrawOnParamChange: KnockoutObservable<boolean>;

		constructor() {
			this.keepRedrawing = ko.observable(false);
			this.redrawOnParamChange = ko.observable(true);
			this.redrawOnParamChange.subscribe((value) => {
				console.log(value);
			})
			this.shaders = ko.observableArray();
			this.selectedShader = ko.observable();
			this.selectedShader.subscribe(({ shader, name }) => {
				shader.use();
				if (this.selectedImage()) {
					shader.bindTexture(this.selectedImage().texture);
					shader.draw();
				}
			});
			this.images = ko.observableArray();
			this.selectedImage = ko.observable();
			this.selectedImage.subscribe((newImage) => {
				this.canvas.width = newImage.image.width;
				this.canvas.height = newImage.image.height;
				gl.viewport(0, 0, this.canvas.width, this.canvas.height);

				//set framebuffer texture dimensions
				this.frameBuffers[0].updateTextureDim(newImage.image.width, newImage.image.height);
				this.frameBuffers[1].updateTextureDim(newImage.image.width, newImage.image.height);

				//draw texture into framebuffer 0
				this.frameBuffers[0].bind();
				this.quadShader.use();
				this.quadShader.bindTexture(newImage.texture);
				this.quadShader.draw();
				this.currentFb = 0;

				this.selectedShader().shader.use();

				/*if (this.selectedShader()) {
					const shader = this.selectedShader().shader;
					shader.bindTexture(newImage.texture);
					shader.draw();
				}*/
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
				const shaderNames = ["swizzle", "shift", "emboss"];
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
			const selectedShader = this.selectedShader().shader;
			selectedShader.use();
			selectedShader.bindTexture(this.frameBuffers[this.currentFb].tex);
			this.frameBuffers[1 - this.currentFb].bind();
			selectedShader.draw();

			//draw into display
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
