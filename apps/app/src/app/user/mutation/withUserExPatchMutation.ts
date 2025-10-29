import { withMutation } from "@use-pico/client";
import type { UserPatch } from "@zbav-se.me/sdk";
import { apiUserExPatch } from "@zbav-se.me/sdk";

export const withUserExPatchMutation = withMutation<UserPatch, void>({
	keys(variables) {
		return [
			"user-ex",
			"patch",
			variables,
		];
	},
	async mutationFn(variables) {
		return apiUserExPatch(variables).then((res) => res.data);
	},
});
