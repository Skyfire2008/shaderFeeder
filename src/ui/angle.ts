namespace ShaderFeeder {

	export class AngleControl {
		public param: Param;
		public value: KnockoutObservable<number>;
		private parent: AppViewModel;
		private dial: HTMLElement;
		private dragging: boolean = false;
		private posX: number;
		private posY: number;
		private startAngle: number;

		constructor(param: Param, parent: AppViewModel, dial: HTMLElement) {
			this.param = param;
			this.parent = parent;
			this.dial = dial;
			const rect = dial.getBoundingClientRect();
			this.posX = (rect.left + rect.right) / 2;
			this.posY = (rect.top + rect.bottom) / 2;
			console.log(this.posX, this.posY);

			dial.addEventListener("mousedown", this.dialMouseDown.bind(this));
			document.addEventListener("mousemove", this.docMouseMove.bind(this));
			document.addEventListener("mouseup", this.docMouseUp.bind(this));

			this.value = ko.observable(<number>param.values).extend({ numeric: null });
			this.value.subscribe((newValue) => {
				param.values = newValue;
				this.param.setter(newValue * Math.PI / 180);
				if (this.parent.redrawOnParamChange()) {
					this.parent.redraw();
				}
			});
		}

		public dispose() {
			this.dial.removeEventListener("mousedown", this.dialMouseDown.bind(this));
			document.removeEventListener("mousemove", this.docMouseMove.bind(this));
			document.removeEventListener("mouseup", this.docMouseUp.bind(this));
		}

		private dialMouseDown(e: MouseEvent) {
			e.preventDefault();

			const rect = this.dial.getBoundingClientRect();
			this.posX = (rect.left + rect.right) / 2;
			this.posY = (rect.top + rect.bottom) / 2;

			this.dragging = true;
			this.startAngle = pos2Angle(e.clientX - this.posX, e.clientY - this.posY) - (this.value() * Math.PI / 180);
		}

		private docMouseMove(e: MouseEvent) {
			if (this.dragging) {
				const currentAngle = pos2Angle(e.clientX - this.posX, e.clientY - this.posY);
				this.value((currentAngle - this.startAngle) * 180 / Math.PI);
			}
		}

		private docMouseUp(e: MouseEvent) {
			if (this.dragging) {
				this.dragging = false;
			}
		}
	}

	ko.components.register("angle-input", {
		viewModel: {
			createViewModel: (params: any, componentInfo: KnockoutComponentTypes.ComponentInfo) => {
				const context = ko.contextFor(componentInfo.element);
				return new AngleControl(context.$data, context.$parent, (<HTMLElement>componentInfo.element).querySelector(".dial"));
			}
		},
		template: `
	<div>
		<div data-bind="text: param.name"></div>
		<svg height="40" width="40" class="dial" data-bind="style: {transform: 'rotate('+value()+'deg)'}">
			<circle cx="20" cy="20" r="20" fill="white" stroke="black"></circle>
			<line x1="20" y1="20" x2="40" y2="20" stroke="black"></line>
		</svg>
		<input type="number" step="any" data-bind="textInput: value"></input>
	</div>`
	});
}
