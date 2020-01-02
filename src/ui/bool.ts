namespace ShaderFeeder {

	export class BoolControl {
		public param: Param;
		private parent: AppViewModel;
		public value: KnockoutObservable<boolean>;

		constructor(param: Param, parent: AppViewModel) {
			this.param = param;
			this.parent = parent;
			this.value = ko.observable(param.values > 0);
			this.value.subscribe((newValue) => {
				param.values = newValue ? 1 : 0;
				param.setter(param.values);
				if (this.parent.redrawOnParamChange()) {
					this.parent.redraw();
				}
			})
		}
	}

	ko.components.register("bool-input", {
		viewModel: {
			createViewModel: (params: any, componentInfo: KnockoutComponentTypes.ComponentInfo) => {
				const context = ko.contextFor(componentInfo.element);
				return new BoolControl(context.$data, context.$parent);
			}
		},
		template: `
		<div>
			<div data-bind="text: param.name"></div>
			<input type="checkbox" data-bind="checked: value"></input>
		</div>
		`
	});
}
