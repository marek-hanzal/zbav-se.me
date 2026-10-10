import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { authClient } from "~/user-auth/service/authClient";

export namespace withEmailSignInMutation {
	export interface Props {
		email: string;
		password: string;
	}
}

export const withEmailSignInMutation = withMutationFn<
	withEmailSignInMutation.Props,
	unknown,
	Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withEmailSignInMutation",
	]),
	keysFn(variables) {
		return [
			"sign-in",
			"email",
			variables,
		];
	},
	async mutationFn(data) {
		const result = await authClient.signIn.email({
			email: data.email,
			password: data.password,
		});

		if (result.error) {
			throw new Error(result.error.message);
		}

		return result.data;
	},
});
