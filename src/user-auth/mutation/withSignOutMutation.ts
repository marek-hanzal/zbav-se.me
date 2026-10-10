import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { authClient } from "~/user-auth/service/authClient";

export const withSignOutMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withSignOutMutation",
	]),
	keys(variables) {
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
