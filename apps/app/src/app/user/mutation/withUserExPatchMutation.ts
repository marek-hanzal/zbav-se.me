import { withMutation } from "@use-pico/client";
import type { tUserPatch } from "@zbav-se.me/sdk";
import { apiUserExPatch } from "@zbav-se.me/sdk";

export const withUserExPatchMutation = withMutation<tUserPatch, void>({
	keys(variables) {
		return [
			"user-ex",
			"patch",
			variables,
		];
	},
	async mutationFn(body) {
		return apiUserExPatch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
