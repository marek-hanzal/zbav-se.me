import { withMutation } from "@use-pico/client/mutation";
import { genId } from "@use-pico/common/gen-id";
import axios from "axios";
import { apiS3Presign, apiUploadCreate } from "../api/session/sdk.gen";
import type {
	tAllowedContentTypes,
	tAllowedExtensions,
	tUpload,
} from "../api/session/types.gen";

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
	tUpload
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
			dot !== -1 && dot < name.length - 1
				? name.slice(dot + 1).toLowerCase()
				: "unknown";

		const presign = await apiS3Presign({
			throwOnError: true,
			body: {
				path: path ?? genId(),
				extension: extension as tAllowedExtensions,
				contentType,
			},
		}).then((res) => res.data);

		await axios.put(presign.url, blob, {
			headers: {
				"Content-Type": contentType,
			},
			onUploadProgress(e) {
				onProgress?.(e.progress ?? 0);
			},
		});

		return apiUploadCreate({
			throwOnError: true,
			body: {
				url: presign.cdn,
			},
		}).then((res) => res.data);
	},
});
