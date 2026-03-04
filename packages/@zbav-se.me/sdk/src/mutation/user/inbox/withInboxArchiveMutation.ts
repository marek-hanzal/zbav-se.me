import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiInboxArchive } from "../../../api/user/sdk.gen";
import type {
	apiInboxArchiveError,
	tApiInboxArchiveResponse,
	tInboxQuery,
} from "../../../api/user/types.gen";

export const withInboxArchiveMutation = withMutation<
	tInboxQuery,
	tApiInboxArchiveResponse[200],
	apiInboxArchiveError
>({
	keys(variables) {
		return [
			"inbox",
			"archive",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiInboxArchive({
				body,
			}),
		);
	},
});
