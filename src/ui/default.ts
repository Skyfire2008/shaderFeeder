//import { Param } from "../shader";

/*interface ViewModel {
	param: KnockoutObservable<Param>;
	values: Array<KnockoutObservable<number>>;
}*/

ko.components.register("default-control", {
	viewModel: {
		createViewModel: (params, componentInfo) => {
			return { name: params.param.name };
		}
	},
	template: `
	<div>
		<div data-bind="text: name"></div>
	</div>`
});

console.log("registered!");

class DefaultControl {

}