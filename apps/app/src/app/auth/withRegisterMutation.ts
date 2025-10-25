import { withMutation } from "@use-pico/client";
import { genId } from "@use-pico/common";
import { authClient } from "~/app/auth/authClient";

export namespace withRegisterMutation {
	export interface Props {
		email: string;
		password: string;
	}
}

export const withRegisterMutation = withMutation<
	withRegisterMutation.Props,
	ReturnType<typeof authClient.signUp.email>
>({
	keys(variables) {
		return [
			"register",
			variables,
		];
	},
	async mutationFn(variables) {
		return authClient.signUp
			.email({
				...variables,
				/**
				 * We don't need user name, so just generate some random shit to make Better Auth happy.
				 */
				name: genId(),
			})
			.then((res) => res.data);
	},
});
