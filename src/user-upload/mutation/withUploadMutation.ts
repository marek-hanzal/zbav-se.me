import axios from "axios";
import type { AccessEnumSchema } from "~/access/schema/AccessEnumSchema";
import { AllowedContentTypesEnumSchema } from "~/application/schema/AllowedContentTypesEnumSchema";
import { AllowedExtensionsEnumSchema } from "~/application/schema/AllowedExtensionsEnumSchema";
import { genId } from "~/identity/fn/genId";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { s3PreSignFn } from "~/user-s3/fn/s3PreSignFn";
import { uploadCreateFn } from "~/user-upload/fn/uploadCreateFn";
import type { UploadSchema } from "~/user-upload/schema/UploadSchema";

export namespace withUploadMutation {
	export interface Props {
		name: string;
		blob: Blob;
		access: AccessEnumSchema.Type;
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
	async mutationFn({ name, blob, access, path, onProgress }) {
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
				access,
				url: presign.cdn,
			},
		});
	},
});
