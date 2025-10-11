import { withMutation } from "@use-pico/client";
import { authClient } from "~/app/auth/authClient";

export const usePasskeyMutation = withMutation<string, boolean>({
	keys(variables) {
		return [
			"passkey",
			variables,
		];
	},
	async mutationFn(variables) {
		const passkey = await authClient.passkey.addPasskey({
			name: variables,
		});

		if (passkey?.error) {
			throw new Error(passkey.error.message);
		}

		return true;
	},
});
