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
		public param: KnockoutObservable<Param>;
		public values: Array<KnockoutObservable<number>>;

		constructor(param: Param) {
			this.param = ko.observable(param);
			console.log(param);
			this.values = [];
			for (let i = 0; i < param.dim; i++) {
				const current = ko.observable(param.defaultValues[i] ? param.defaultValues[i] : 0).extend({ numeric: null });
				current.subscribe((value) => {
					console.log(value);
				})
				this.values.push(current);
			}

		}
	}

	ko.components.register("default-control", {
		viewModel: {
			createViewModel: (param: Param, componentInfo) => {
				return new DefaultControl(param);
			}
		},
		template: `
	<div>
		<div data-bind="text: param().name"></div>
		<!-- ko foreach: values -->
			<input type="number" step="any" data-bind="textInput: $rawData"></input>
		<!-- /ko -->
	</div>`
	});

}
