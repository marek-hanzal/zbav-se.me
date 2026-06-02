import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { authClient } from "~/user/auth/authClient";

export namespace withResetPasswordMutation {
	export interface Props {
		token: string;
		newPassword: string;
	}
}

export const withResetPasswordMutation = withMutation<
	withResetPasswordMutation.Props,
	unknown,
	Error
>({
	logger: getRootLogger([
		"mutation",
		"withResetPasswordMutation",
	]),
	keys(variables) {
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
