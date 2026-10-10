import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { authClient } from "~/user-auth/service/authClient";

export namespace withPasswordChangeMutation {
	export interface Props {
		current: string;
		password: string;
	}
}

export const withPasswordChangeMutation = withMutationFn<
	withPasswordChangeMutation.Props,
	unknown,
	Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withPasswordChangeMutation",
	]),
	keysFn(variables) {
		return [
			"register",
			variables,
		];
	},
	async mutationFn({ current, password }) {
		const result = await authClient.changePassword({
			currentPassword: current,
			newPassword: password,
			revokeOtherSessions: true,
		});

		if (result.error) {
			throw new Error(result.error.message);
		}

		return result.data;
	},
});
