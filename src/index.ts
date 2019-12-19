namespace ShaderFeeder {

	interface NamedImage {
		image: HTMLImageElement;
		texture: Texture;
		name: string;
	}

	class ViewModel {
		public images: KnockoutObservableArray<NamedImage>;
		public selectedImage: KnockoutObservable<NamedImage>;
		public canvas: HTMLCanvasElement;
		public gl: WebGLRenderingContext;

		constructor() {
			this.images = ko.observableArray();
			this.selectedImage = ko.observable();
			this.selectedImage.subscribe((newImage) => {
				this.canvas.width = newImage.image.width;
				this.canvas.height = newImage.image.height;
				this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
			});

			this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
			this.gl = this.canvas.getContext("webgl");
			if (!this.gl) {
				console.error("Could not create webGL rendering context");
			}
			Texture.init(this.gl);

			fetchFile("shaders/quad.vert").then((value) => {
				Shader.init(this.gl, value);
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
