import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { authClient } from "~/user-auth/service/authClient";

export namespace withRegisterMutation {
	export interface Props {
		email: string;
		password: string;
	}
}

export const withRegisterMutation = withMutationFn<withRegisterMutation.Props, unknown, Error>({
	logger: getRootLoggerFn([
		"mutation",
		"withRegisterMutation",
	]),
	keysFn(variables) {
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
