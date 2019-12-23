namespace ShaderFeeder {

	export class EnumControl {
		public param: KnockoutObservable<Param>;
		public selectedValue: KnockoutObservable<number>;

		constructor(param: Param) {
			this.param = ko.observable(param);
			this.selectedValue = ko.observable(0);
			this.selectedValue.subscribe((newValue) => {
				console.log(newValue);
			})
		}

		public select(e: Event): void {
			console.log(e);
		}
	}

	ko.components.register("enum-input", {
		viewModel: {
			createViewModel: (param: Param, componentInfo) => {
				return new EnumControl(param);
			}
		},
		template: `
		<div>
			<div data-bind="text: param().name"></div>
			<select data-bind="value: selectedValue">
				<!-- ko foreach: param().enumValues -->
					<option data-bind="text: $data, attr: {value: $index}"></option>
				<!-- /ko -->
			</select>
		</div>
		`
	});
}