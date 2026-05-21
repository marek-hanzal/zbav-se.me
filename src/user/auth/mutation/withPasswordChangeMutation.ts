import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { authClient } from "~/user/auth/authClient";

export namespace withPasswordChangeMutation {
	export interface Props {
		current: string;
		password: string;
	}
}

export const withPasswordChangeMutation = withMutation<
	withPasswordChangeMutation.Props,
	unknown,
	Error
>({
	logger: getRootLogger([
		"mutation",
		"withPasswordChangeMutation",
	]),
	keys(variables) {
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
