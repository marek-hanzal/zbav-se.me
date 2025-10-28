import { withMutation } from "@use-pico/client";
import { genId } from "@use-pico/common";
import {
	type AllowedContentTypes,
	type AllowedExtensions,
	apiS3Presign,
	apiUploadCreate,
} from "@zbav-se.me/sdk";
import axios from "axios";

export namespace withUploadMutation {
	export interface Props {
		name: string;
		blob: Blob;
		path?: string;
		onProgress?(progress: number): void;
	}
}

export const withUploadMutation = withMutation<withUploadMutation.Props, any>({
	keys(variables) {
		return [
			"upload",
			variables,
		];
	},
	async mutationFn({ name, blob, path, onProgress }) {
		const contentType = blob.type as AllowedContentTypes;

		const dot = name.lastIndexOf(".");
		const extension =
			dot !== -1 && dot < name.length - 1
				? name.slice(dot + 1).toLowerCase()
				: "unknown";

		const presign = await apiS3Presign({
			path: path ?? genId(),
			extension: extension as AllowedExtensions,
			contentType,
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
			url: presign.cdn,
		}).then((res) => res.data);
	},
});
