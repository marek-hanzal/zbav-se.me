import { withMutation } from "../mutation";

export const withNoopMutation = withMutation<any, any, Error>({
	keys() {
		return [
			"noop-mutation",
		];
	},
	async mutationFn(variables) {
		return variables;
	},
});
