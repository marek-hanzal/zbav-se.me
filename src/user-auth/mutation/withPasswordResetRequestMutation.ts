import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { authClient } from "~/user-auth/service/authClient";

export namespace withPasswordResetRequestMutation {
	export interface Props {
		email: string;
		redirectTo: string;
	}
}

export const withPasswordResetRequestMutation = withMutationFn<
	withPasswordResetRequestMutation.Props,
	unknown,
	Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withPasswordResetRequestMutation",
	]),
	keysFn(variables) {
		return [
			"password-reset",
			"request",
			variables,
		];
	},
	async mutationFn(data) {
		const result = await authClient.requestPasswordReset({
			email: data.email,
			redirectTo: data.redirectTo,
		});

		if (result.error) {
			throw new Error(result.error.message);
		}

		return result.data;
	},
});
