import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { signInFn } from "~/user/auth/fn/signInFn";

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
		return signInFn({
			data,
		});
	},
});
