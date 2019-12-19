namespace ShaderFeeder {

	export function fetchFile(path: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const req = new XMLHttpRequest();
			req.addEventListener("load", (e: ProgressEvent) => {
				resolve(req.responseText);
			});
			req.addEventListener("error", () => {
				reject("Oopsie!");
			});
			req.open("GET", path);
			req.send();
		});

	}
}