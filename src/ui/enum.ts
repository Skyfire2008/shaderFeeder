namespace ShaderFeeder {

	export class EnumControl {
		public param: Param;
		private parent: AppViewModel;
		public selectedValue: KnockoutObservable<number>;

		constructor(param: Param, parent: AppViewModel) {
			this.param = param;
			this.parent = parent;
			this.selectedValue = ko.observable(0);
			this.selectedValue.subscribe((newValue) => {
				this.param.setter(newValue);
				if (this.parent.redrawOnParamChange()) {
					this.parent.redraw();
				}
			})
		}

		public select(e: Event): void {
			console.log(e);
		}
	}

	ko.components.register("enum-input", {
		viewModel: {
			createViewModel: (params: any, componentInfo: KnockoutComponentTypes.ComponentInfo) => {
				const context = ko.contextFor(componentInfo.element);
				return new EnumControl(context.$data, context.$parent);
			}
		},
		template: `
		<div>
			<div data-bind="text: param.name"></div>
			<select data-bind="value: selectedValue">
				<!-- ko foreach: param.enumValues -->
					<option data-bind="text: $data, attr: {value: $index}"></option>
				<!-- /ko -->
			</select>
		</div>
		`
	});
}
