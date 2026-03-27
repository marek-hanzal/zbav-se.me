import { withMutation } from "@use-pico/client/mutation";
import { genId } from "@use-pico/common/gen-id";
import { authClient } from "~/@common/auth/authClient";

export namespace withRegisterMutation {
	export interface Props {
		email: string;
		password: string;
	}
}

export const withRegisterMutation = withMutation<
	withRegisterMutation.Props,
	ReturnType<typeof authClient.signUp.email>,
	unknown
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
				name: genId(),
			})
			.then((res) => res.data);
	},
});
