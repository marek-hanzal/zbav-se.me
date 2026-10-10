import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { authClient } from "~/user-auth/service/authClient";

export namespace withMagicLinkSignInMutation {
	export interface Props {
		email: string;
		callbackURL: string;
	}
}

export const withMagicLinkSignInMutation = withMutation<
	withMagicLinkSignInMutation.Props,
	unknown,
	Error
>({
	logger: getRootLogger([
		"mutation",
		"withMagicLinkSignInMutation",
	]),
	keys(variables) {
		return [
			"sign-in",
			"magic-link",
			variables,
		];
	},
	async mutationFn(data) {
		const result = await authClient.signIn.magicLink({
			email: data.email,
			callbackURL: data.callbackURL,
		});

		if (result.error) {
			throw new Error(result.error.message);
		}

		return result.data;
	},
});
