import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withEntityQueryFn } from "~/query/fn/withEntityQueryFn";
import { uploadCollectionFn } from "~/user-upload/fn/uploadCollectionFn";
import { uploadCountFn } from "~/user-upload/fn/uploadCountFn";
import { uploadCreateFn } from "~/user-upload/fn/uploadCreateFn";
import { uploadFetchFn } from "~/user-upload/fn/uploadFetchFn";
import type { UploadCountQuerySchema } from "~/user-upload/schema/UploadCountQuerySchema";
import type { UploadCreateSchema } from "~/user-upload/schema/UploadCreateSchema";
import type { UploadQuerySchema } from "~/user-upload/schema/UploadQuerySchema";
import type { UploadSchema } from "~/user-upload/schema/UploadSchema";

export const withUploadQuery = withEntityQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withUploadQuery",
	]),
	errors: {} as {
		fetch: uploadFetchFn.Error;
		collection: uploadCollectionFn.Error;
		count: uploadCountFn.Error;
		patch: Error;
		create: uploadCreateFn.Error;
		delete: Error;
		patchCollection: Error;
	},
	keysFn() {
		return [
			"upload",
		];
	},
	toIdKeyFn(id): UploadQuerySchema.Type {
		return {
			where: {
				id,
			},
		};
	},
	async fetchFn(data: UploadQuerySchema.Type) {
		return uploadFetchFn({
			data,
		});
	},
	async collectionFn(data: UploadQuerySchema.Type) {
		return uploadCollectionFn({
			data,
		});
	},
	async countFn(data: UploadCountQuerySchema.Type) {
		return uploadCountFn({
			data,
		});
	},
	async createFn(data: UploadCreateSchema.Type) {
		return uploadCreateFn({
			data,
		});
	},
	async patchFn(_data: never): Promise<UploadSchema.Type> {
		throw new Error("Upload patch is not supported.");
	},
	async patchCollectionFn(_data: never): Promise<UploadSchema.Type[]> {
		throw new Error("Upload collection patch is not supported.");
	},
	async deleteFn(_data: never): Promise<UploadSchema.Type> {
		throw new Error("Upload delete is not supported.");
	},
});
