import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { authClient } from "~/user-auth/service/authClient";

export const withSignOutMutation = withMutationFn({
	logger: getRootLoggerFn([
		"mutation",
		"withSignOutMutation",
	]),
	keysFn(variables) {
		return [
			"signOut",
			variables,
		];
	},
	async mutationFn() {
		const result = await authClient.signOut();

		if (result.error) {
			throw new Error(result.error.message);
		}

		return result.data;
	},
});
