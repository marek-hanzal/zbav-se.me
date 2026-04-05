import { withMutation } from "@/lib/client/mutation";
import { signOutFn } from "~/user/auth/fn/signOutFn";

export const withSignOutMutation = withMutation({
	keys(variables) {
		return [
			"signOut",
			variables,
		];
	},
	async mutationFn() {
		return signOutFn();
	},
});
