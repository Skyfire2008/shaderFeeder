namespace ShaderFeeder {

	interface NamedShader {
		shader: Shader;
		name: string;
	}

	interface NamedImage {
		image: HTMLImageElement;
		texture: Texture;
		name: string;
	}

	class ViewModel {
		public shaders: KnockoutObservableArray<NamedShader>;
		public selectedShader: KnockoutObservable<NamedShader>;
		public images: KnockoutObservableArray<NamedImage>;
		public selectedImage: KnockoutObservable<NamedImage>;
		public canvas: HTMLCanvasElement;
		public gl: WebGLRenderingContext;

		constructor() {
			this.shaders = ko.observableArray();
			this.selectedShader = ko.observable();
			this.selectedShader.subscribe(({ shader, name }) => {
				shader.use();
				if (this.selectedImage()) {
					shader.bindTexture(this.selectedImage().texture);
					shader.draw();
				}
			})
			this.images = ko.observableArray();
			this.selectedImage = ko.observable();
			this.selectedImage.subscribe((newImage) => {
				this.canvas.width = newImage.image.width;
				this.canvas.height = newImage.image.height;
				this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

				if (this.selectedShader()) {
					const shader = this.selectedShader().shader;
					shader.bindTexture(newImage.texture);
					shader.draw();
				}
			});

			//get webGL context
			this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
			this.gl = this.canvas.getContext("webgl");
			if (!this.gl) {
				console.error("Could not create webGL rendering context");
			}
			Texture.init(this.gl);

			//load vertex shader and init Shader object
			fetchFile("shaders/quad.vert").then((value) => {
				Shader.init(this.gl, value);

				//load all shaders
				const shaderNames = ["swizzle", "shift"];
				for (const name of shaderNames) {
					fetchFile(`shaders/${name}.frag`).then((shaderSrc) => {
						this.shaders.push({ name, shader: new Shader(shaderSrc) });
					});
				}
			});
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
		const viewModel = new ViewModel();
		ko.applyBindings(viewModel);
	});
}
