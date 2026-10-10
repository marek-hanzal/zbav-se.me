import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withEntityQueryFn } from "~/query/fn/withEntityQueryFn";
import { resourceLimitCollectionFn } from "~/user-resource-limit/fn/resourceLimitCollectionFn";
import { resourceLimitCountFn } from "~/user-resource-limit/fn/resourceLimitCountFn";
import { resourceLimitFetchFn } from "~/user-resource-limit/fn/resourceLimitFetchFn";
import type { ResourceLimitCountQuerySchema } from "~/user-resource-limit/schema/ResourceLimitCountQuerySchema";
import type { ResourceLimitQuerySchema } from "~/user-resource-limit/schema/ResourceLimitQuerySchema";
import type { ResourceLimitSchema } from "~/user-resource-limit/schema/ResourceLimitSchema";

export const withResourceLimitQuery = withEntityQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withResourceLimitQuery",
	]),
	errors: {} as {
		fetch: resourceLimitFetchFn.Error;
		collection: resourceLimitCollectionFn.Error;
		count: resourceLimitCountFn.Error;
		patch: Error;
		create: Error;
		delete: Error;
		patchCollection: Error;
	},
	keysFn() {
		return [
			"resource",
			"limit",
		];
	},
	toIdKeyFn(id): ResourceLimitQuerySchema.Type {
		return {
			where: {
				id,
			},
		};
	},
	async fetchFn(data: ResourceLimitQuerySchema.Type) {
		return resourceLimitFetchFn({
			data,
		});
	},
	async collectionFn(data: ResourceLimitQuerySchema.Type) {
		return resourceLimitCollectionFn({
			data,
		});
	},
	async countFn(data: ResourceLimitCountQuerySchema.Type) {
		return resourceLimitCountFn({
			data,
		});
	},
	async createFn(_data: never): Promise<ResourceLimitSchema.Type> {
		throw new Error("Resource limit create is not supported.");
	},
	async patchFn(_data: never): Promise<ResourceLimitSchema.Type> {
		throw new Error("Resource limit patch is not supported.");
	},
	async patchCollectionFn(_data: never): Promise<ResourceLimitSchema.Type[]> {
		throw new Error("Resource limit collection patch is not supported.");
	},
	async deleteFn(_data: never): Promise<ResourceLimitSchema.Type> {
		throw new Error("Resource limit delete is not supported.");
	},
});
