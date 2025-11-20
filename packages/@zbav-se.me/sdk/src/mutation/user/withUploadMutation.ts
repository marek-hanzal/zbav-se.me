import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { genId } from "@use-pico/common/gen-id";
import axios from "axios";
import { apiS3Presign, apiUploadCreate } from "../../api/user/sdk.gen";
import type {
	apiS3PresignError,
	apiUploadCreateError,
	tAllowedContentTypes,
	tAllowedExtensions,
	tUpload,
} from "../../api/user/types.gen";

export namespace withUploadMutation {
	export interface Props {
		name: string;
		blob: Blob;
		path?: string;
		onProgress?(progress: number): void;
	}
}

export const withUploadMutation = withMutation<
	withUploadMutation.Props,
	tUpload,
	apiS3PresignError | apiUploadCreateError
>({
	keys(variables) {
		return [
			"upload",
			variables,
		];
	},
	async mutationFn({ name, blob, path, onProgress }) {
		const contentType = blob.type as tAllowedContentTypes;

		const dot = name.lastIndexOf(".");
		const extension =
			dot !== -1 && dot < name.length - 1 ? name.slice(dot + 1).toLowerCase() : "unknown";

		const presign = await withApi(
			apiS3Presign({
				body: {
					path: path ?? genId(),
					extension: extension as tAllowedExtensions,
					contentType,
				},
			}),
		);

		await axios.put(presign.url, blob, {
			headers: {
				"Content-Type": contentType,
			},
			onUploadProgress(e) {
				onProgress?.(e.progress ?? 0);
			},
		});

		return withApi(
			apiUploadCreate({
				body: {
					url: presign.cdn,
				},
			}),
		);
	},
});
