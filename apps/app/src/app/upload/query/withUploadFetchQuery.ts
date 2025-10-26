import { withQuery } from "@use-pico/client";
import {
	apiUploadFetch,
	type UploadDto,
	type UploadQuery,
} from "@zbav-se.me/sdk";

export const withUploadFetchQuery = withQuery<UploadQuery, UploadDto>({
	keys(variables) {
		return [
			"upload",
			"fetch",
			variables,
		];
	},
	async queryFn(variables) {
		return apiUploadFetch(variables).then((res) => res.data);
	},
});
