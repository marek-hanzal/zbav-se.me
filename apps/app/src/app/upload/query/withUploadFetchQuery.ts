import { withQuery } from "@use-pico/client/query";
import {
	apiUploadFetch,
	type tUploadDto,
	type tUploadQuery,
} from "@zbav-se.me/sdk";

export const withUploadFetchQuery = withQuery<tUploadQuery, tUploadDto>({
	keys(variables) {
		return [
			"upload",
			"fetch",
			variables,
		];
	},
	async queryFn(body) {
		return apiUploadFetch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
