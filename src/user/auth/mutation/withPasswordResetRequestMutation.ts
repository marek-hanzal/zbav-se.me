import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { authClient } from "~/user/auth/authClient";

export namespace withPasswordResetRequestMutation {
	export interface Props {
		email: string;
		redirectTo: string;
	}
}

export const withPasswordResetRequestMutation = withMutation<
	withPasswordResetRequestMutation.Props,
	unknown,
	Error
>({
	logger: getRootLogger([
		"mutation",
		"withPasswordResetRequestMutation",
	]),
	keys(variables) {
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
