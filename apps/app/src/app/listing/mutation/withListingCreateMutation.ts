import { withMutation } from "@use-pico/client/mutation";
import {
	apiListingCreate,
	type tListingCreate,
	type tListingDto,
} from "@zbav-se.me/sdk";

export const withListingCreateMutation = withMutation<
	tListingCreate,
	tListingDto
>({
	keys() {
		return [
			"listing",
			"create",
		];
	},
	async mutationFn(body) {
		return apiListingCreate({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
