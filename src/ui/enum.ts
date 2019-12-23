namespace ShaderFeeder {

	export class EnumControl {
		public param: Param;
		public selectedValue: KnockoutObservable<number>;

		constructor(param: Param) {
			this.param = param;
			this.selectedValue = ko.observable(0);
			this.selectedValue.subscribe((newValue) => {
				this.param.setter(newValue);
				this.param.owner.draw();
			})
		}

		public select(e: Event): void {
			console.log(e);
		}
	}

	ko.components.register("enum-input", {
		viewModel: {
			createViewModel: (params: any, componentInfo: KnockoutComponentTypes.ComponentInfo) => {
				return new EnumControl(ko.contextFor(componentInfo.element).$data);
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
