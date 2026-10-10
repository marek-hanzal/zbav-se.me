import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { authClient } from "~/user-auth/service/authClient";

export namespace withResetPasswordMutation {
	export interface Props {
		token: string;
		newPassword: string;
	}
}

export const withResetPasswordMutation = withMutationFn<
	withResetPasswordMutation.Props,
	unknown,
	Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withResetPasswordMutation",
	]),
	keysFn(variables) {
		return [
			"password-reset",
			"confirm",
			variables,
		];
	},
	async mutationFn(data) {
		const result = await authClient.resetPassword({
			newPassword: data.newPassword,
			token: data.token,
		});

		if (result.error) {
			throw new Error(result.error.message);
		}

		return result.data;
	},
});
