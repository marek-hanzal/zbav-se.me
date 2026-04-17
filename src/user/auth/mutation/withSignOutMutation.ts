import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { signOutFn } from "~/user/auth/fn/signOutFn";

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
		return signOutFn();
	},
});
