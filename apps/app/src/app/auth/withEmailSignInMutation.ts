import { withMutation } from "@use-pico/client/mutation";
import { authClient } from "~/app/auth/authClient";

export namespace withEmailSignInMutation {
	export interface Props {
		email: string;
		password: string;
	}
}

export const withEmailSignInMutation = withMutation<
	withEmailSignInMutation.Props,
	ReturnType<typeof authClient.signIn.email>,
	unknown
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
