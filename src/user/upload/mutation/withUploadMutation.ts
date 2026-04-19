import axios from "axios";
import { withMutation } from "@/lib/client/mutation";
import { genId } from "@/lib/common/gen-id";
import { getRootLogger } from "~/common/log/getRootLogger";
import { AllowedContentTypesEnumSchema } from "~/common/schema/AllowedContentTypesEnumSchema";
import { AllowedExtensionsEnumSchema } from "~/common/schema/AllowedExtensionsEnumSchema";
import { s3PreSignFn } from "~/user/s3/fn/s3PreSignFn";
import { uploadCreateFn } from "~/user/upload/fn/uploadCreateFn";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";

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
	UploadSchema.Type,
	s3PreSignFn.Error | uploadCreateFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withUploadMutation",
	]),
	keys(variables) {
		return [
			"upload",
			variables,
		];
	},
	async mutationFn({ name, blob, path, onProgress }) {
		const contentType = AllowedContentTypesEnumSchema.parse(blob.type);

		const dot = name.lastIndexOf(".");
		const extension = AllowedExtensionsEnumSchema.parse(
			dot !== -1 && dot < name.length - 1 ? name.slice(dot + 1).toLowerCase() : "unknown",
		);

		const presign = await s3PreSignFn({
			data: {
				path: path ?? genId(),
				extension,
				contentType,
			},
		});

		await axios.put(presign.url, blob, {
			headers: {
				"Content-Type": contentType,
			},
			onUploadProgress(e) {
				onProgress?.(e.progress ?? 0);
			},
		});

		return uploadCreateFn({
			data: {
				url: presign.cdn,
			},
		});
	},
});
