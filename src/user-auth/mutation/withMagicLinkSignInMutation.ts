import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { authClient } from "~/user-auth/service/authClient";

export namespace withMagicLinkSignInMutation {
	export interface Props {
		email: string;
		callbackURL: string;
	}
}

export const withMagicLinkSignInMutation = withMutationFn<
	withMagicLinkSignInMutation.Props,
	unknown,
	Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withMagicLinkSignInMutation",
	]),
	keysFn(variables) {
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
