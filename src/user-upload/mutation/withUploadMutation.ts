import axios from "axios";
import type { AccessEnumSchema } from "~/access/schema/AccessEnumSchema";
import { AllowedContentTypesEnumSchema } from "~/application/schema/AllowedContentTypesEnumSchema";
import { AllowedExtensionsEnumSchema } from "~/application/schema/AllowedExtensionsEnumSchema";
import { genIdFn } from "~/identity/fn/genIdFn";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { s3PreSignFn } from "~/user-s3/fn/s3PreSignFn";
import { uploadCreateFn } from "~/user-upload/fn/uploadCreateFn";
import type { UploadSchema } from "~/user-upload/schema/UploadSchema";

export namespace withUploadMutation {
	export interface Props {
		name: string;
		blob: Blob;
		access: AccessEnumSchema.Type;
		path?: string;
		onProgressFn?(progress: number): void;
	}
}

export const withUploadMutation = withMutationFn<
	withUploadMutation.Props,
	UploadSchema.Type,
	s3PreSignFn.Error | uploadCreateFn.Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withUploadMutation",
	]),
	keysFn(variables) {
		return [
			"upload",
			variables,
		];
	},
	async mutationFn({ name, blob, access, path, onProgressFn }) {
		const contentType = AllowedContentTypesEnumSchema.parse(blob.type);

		const dot = name.lastIndexOf(".");
		const extension = AllowedExtensionsEnumSchema.parse(
			dot !== -1 && dot < name.length - 1 ? name.slice(dot + 1).toLowerCase() : "unknown",
		);

		const presign = await s3PreSignFn({
			data: {
				path: path ?? genIdFn(),
				extension,
				contentType,
			},
		});

		await axios.put(presign.url, blob, {
			headers: {
				"Content-Type": contentType,
			},
			onUploadProgress(e) {
				onProgressFn?.(e.progress ?? 0);
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
