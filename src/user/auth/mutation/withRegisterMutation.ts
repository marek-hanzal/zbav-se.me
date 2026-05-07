import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { signUpFn } from "~/user/auth/fn/signUpFn";

export namespace withRegisterMutation {
	export interface Props {
		email: string;
		password: string;
	}
}

export const withRegisterMutation = withMutation<withRegisterMutation.Props, unknown, Error>({
	logger: getRootLogger([
		"mutation",
		"withRegisterMutation",
	]),
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
