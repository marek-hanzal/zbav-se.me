import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { authClient } from "~/user/auth/authClient";

export namespace withEmailSignInMutation {
	export interface Props {
		email: string;
		password: string;
	}
}

export const withEmailSignInMutation = withMutation<withEmailSignInMutation.Props, unknown, Error>({
	logger: getRootLogger([
		"mutation",
		"withEmailSignInMutation",
	]),
	keys(variables) {
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
