import { withMutation } from "@use-pico/client";
import { authClient } from "~/app/auth/authClient";

export namespace withRegisterMutation {
	export interface Props {
		email: string;
		password: string;
		name: string;
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
		return authClient.signUp.email(variables).then((res) => res.data);
	},
});
