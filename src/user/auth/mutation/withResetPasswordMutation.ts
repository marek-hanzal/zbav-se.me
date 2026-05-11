import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { resetPasswordFn } from "~/user/auth/fn/resetPasswordFn";

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
		return resetPasswordFn({
			data,
		});
	},
});
