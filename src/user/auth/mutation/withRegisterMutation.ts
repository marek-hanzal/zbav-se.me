import { getRootLogger } from "~/common/log/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { authClient } from "~/user/auth/authClient";

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
		const result = await authClient.signUp.email({
			email: data.email,
			name: data.email,
			password: data.password,
		});

		if (result.error) {
			throw new Error(result.error.message);
		}

		return result.data;
	},
});
