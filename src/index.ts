namespace ShaderFeeder {

	interface NamedImage {
		image: HTMLImageElement;
		texture: Texture;
		name: string;
	}

	class ViewModel {
		public images: KnockoutObservableArray<NamedImage>;
		public gl: WebGLRenderingContext;

		constructor() {
			this.images = ko.observableArray();

			const canvas = <HTMLCanvasElement>document.getElementById("canvas");
			this.gl = canvas.getContext("webgl");
			if (!this.gl) {
				console.error("Could not create webGL renderign context");
			}
			Texture.init(this.gl);
			Shader.init(this.gl);
		}

		public uploadFile(file: File) {
			const fr = new FileReader();
			fr.onload = (e: any) => {
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
