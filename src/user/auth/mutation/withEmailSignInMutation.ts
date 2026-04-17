import { withMutation } from "@/lib/client/mutation";
import { signInFn } from "~/user/auth/fn/signInFn";

export namespace withEmailSignInMutation {
	export interface Props {
		email: string;
		password: string;
	}
}

export const withEmailSignInMutation = withMutation<withEmailSignInMutation.Props, unknown, Error>({
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
