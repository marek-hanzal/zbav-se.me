import { withMutation } from "@/lib/client/mutation";
import { signUpFn } from "~/user/auth/fn/signUpFn";

export namespace withRegisterMutation {
	export interface Props {
		email: string;
		password: string;
	}
}

export const withRegisterMutation = withMutation<withRegisterMutation.Props, unknown, Error>({
	keys(variables) {
		return [
			"register",
			variables,
		];
	},
	async mutationFn(data) {
		return signUpFn({
			data,
		});
	},
});
