import { withMutation } from "@/lib/client/mutation";
import { authClient } from "~/common/auth/authClient";

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
