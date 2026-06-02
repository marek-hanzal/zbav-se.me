import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { authClient } from "~/user/auth/authClient";

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
