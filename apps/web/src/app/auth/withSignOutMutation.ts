import { withMutation } from "@use-pico/client";
import { authClient } from "~/app/auth/authClient";

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
