import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { authClient } from "~/user/auth/authClient";

export namespace withEmailVerificationRequestMutation {
	export interface Props {
		email: string;
		callbackURL: string;
	}
}

export const withEmailVerificationRequestMutation = withMutation<
	withEmailVerificationRequestMutation.Props,
	unknown,
	Error
>({
	logger: getRootLogger([
		"mutation",
		"withEmailVerificationRequestMutation",
	]),
	keys(variables) {
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
