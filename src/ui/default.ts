interface KnockoutExtenders {
	numeric: (target: any) => KnockoutComputed<number>;
}

ko.extenders.numeric = (target: any) => {
	const result: KnockoutComputed<number> = ko.pureComputed({
		read: target,
		write: (newValue: any) => {
			const current = target();
			const newNumber = parseFloat(newValue);
			if (!isNaN(newNumber) && current !== newValue) {
				target(newNumber);
			}
		}
	});

	result(target);

	return result;
}

namespace ShaderFeeder {

	export class DefaultControl {
		public param: Param;
		public values: Array<KnockoutObservable<number>>;

		constructor(param: Param) {
			this.param = param;
			this.values = [];
			for (let i = 0; i < param.dim; i++) {
				const current = ko.observable(param.defaultValues[i] ? param.defaultValues[i] : 0).extend({ numeric: null }); //TODO: fix this, doesn't consider the fact that default value can be a number
				current.subscribe((value) => {
					this.param.setter(this.values.map((value) => { return value(); }));
					this.param.owner.draw();
				})
				this.values.push(current);
			}

		}
	}

	ko.components.register("default-input", {
		viewModel: {
			createViewModel: (params: any, componentInfo: KnockoutComponentTypes.ComponentInfo) => {
				return new DefaultControl(ko.contextFor(componentInfo.element).$data);
			}
		},
		template: `
	<div>
		<div data-bind="text: param.name"></div>
		<!-- ko foreach: values -->
			<input type="number" step="any" data-bind="textInput: $rawData"></input>
		<!-- /ko -->
	</div>`
	});

}
