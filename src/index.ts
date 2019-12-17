namespace ShaderFeeder {

	interface NamedImage {
		image: HTMLImageElement;
		name: string;
	}

	class ViewModel {
		public images: KnockoutObservableArray<NamedImage>;

		constructor() {
			this.images = ko.observableArray();
		}

		public uploadFile(file: File) {
			const fr = new FileReader();
			fr.onload = (e: any) => {
				const img = new Image();
				img.onload = (e: Event) => {
					this.images.push({
						name: file.name,
						image: img
					});

				};

				img.src = <string>e.target.result;
			};

			fr.readAsDataURL(file);
		}
	}

	window.addEventListener("load", () => {
		ko.applyBindings(new ViewModel());
	});
}
