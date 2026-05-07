import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { uploadCollectionFn } from "~/user/upload/fn/uploadCollectionFn";
import { uploadCountFn } from "~/user/upload/fn/uploadCountFn";
import { uploadCreateFn } from "~/user/upload/fn/uploadCreateFn";
import { uploadFetchFn } from "~/user/upload/fn/uploadFetchFn";
import type { UploadCountQuerySchema } from "~/user/upload/server/schema/UploadCountQuerySchema";
import type { UploadCreateSchema } from "~/user/upload/server/schema/UploadCreateSchema";
import type { UploadQuerySchema } from "~/user/upload/server/schema/UploadQuerySchema";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";

export const withUploadQuery = withEntityQuery({
	logger: getRootLogger([
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
	keys() {
		return [
			"upload",
		];
	},
	toIdKey(id): UploadQuerySchema.Type {
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
