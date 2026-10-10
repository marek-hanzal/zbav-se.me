import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { authClient } from "~/user-auth/service/authClient";

export namespace withEmailVerificationRequestMutation {
	export interface Props {
		email: string;
		callbackURL: string;
	}
}

export const withEmailVerificationRequestMutation = withMutationFn<
	withEmailVerificationRequestMutation.Props,
	unknown,
	Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withEmailVerificationRequestMutation",
	]),
	keysFn(variables) {
		return [
			"email-verification",
			"request",
			variables,
		];
	},
	async mutationFn(data) {
		const result = await authClient.sendVerificationEmail({
			email: data.email,
			callbackURL: data.callbackURL,
		});

		if (result.error) {
			throw new Error(result.error.message);
		}

		return result.data;
	},
});
