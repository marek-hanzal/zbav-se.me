import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { requestPasswordResetFn } from "~/user/auth/fn/requestPasswordResetFn";

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
		return requestPasswordResetFn({
			data,
		});
	},
});
