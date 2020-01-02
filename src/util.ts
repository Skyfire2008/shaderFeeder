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

	export function makeParamSetter(gl: WebGLRenderingContext, location: WebGLUniformLocation, dim: number, type: TypeEnum): (value: number | Array<number> | boolean) => void {
		const funcName = `uniform${dim}${type.charAt(0)}`;

		if (dim === 1) {
			return (value: number) => {
				gl[funcName](location, value);
			};
		} else if (type === TypeEnum.float) {
			return (value: Array<number>) => {
				gl[funcName + "v"](location, value);
			}
		} else {
			return (value: Array<number>) => {
				gl[funcName + "v"](location, new Int32Array(value));
			}
		}
	}

	export function makeDefaultParamValues(dim: number): number | Array<number> {
		if (dim === 1) {
			return 0;
		} else {
			const result: Array<number> = [];
			for (let i = 0; i < dim; i++) {
				result.push(0);
			}
			return result;
		}
	}

	export function pos2Angle(x: number, y: number): number {
		return Math.atan2(y, x);
	}
}
