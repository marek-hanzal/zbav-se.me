import { withMutation } from "@use-pico/client";
import { authClient } from "~/app/auth/authClient";

export namespace withEmailSignInMutation {
	export interface Props {
		email: string;
		password: string;
	}
}

export const withEmailSignInMutation = withMutation<
	withEmailSignInMutation.Props,
	any
>({
	keys(variables) {
		return [
			"sign-in",
			"email",
			variables,
		];
	},
	async mutationFn(variables) {
		return authClient.signIn.email(variables);
	},
});
