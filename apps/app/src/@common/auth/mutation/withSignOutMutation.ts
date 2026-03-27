import { withMutation } from "@use-pico/client/mutation";
import { authClient } from "~/@common/auth/authClient";

export const withSignOutMutation = withMutation({
	keys(variables) {
		return [
			"signOut",
			variables,
		];
	},
	async mutationFn() {
		return authClient.signOut();
	},
});
