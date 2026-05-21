import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { authClient } from "~/user/auth/authClient";

export namespace withMagicLinkSignInMutation {
	export interface Props {
		email: string;
		password: string;
	}
}

export const withMagicLinkSignInMutation = withMutation<withMagicLinkSignInMutation.Props, unknown, Error>({
	logger: getRootLogger([
		"mutation",
		"withMagicLinkSignInMutation",
	]),
	keys(variables) {
		return [
			"sign-in",
			"magic-link",
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
