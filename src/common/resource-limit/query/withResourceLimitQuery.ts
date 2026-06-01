import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { resourceLimitCollectionFn } from "~/common/resource-limit/fn/resourceLimitCollectionFn";
import { resourceLimitCountFn } from "~/common/resource-limit/fn/resourceLimitCountFn";
import { resourceLimitFetchFn } from "~/common/resource-limit/fn/resourceLimitFetchFn";
import type { ResourceLimitCountQuerySchema } from "~/common/resource-limit/server/schema/ResourceLimitCountQuerySchema";
import type { ResourceLimitQuerySchema } from "~/common/resource-limit/server/schema/ResourceLimitQuerySchema";
import type { ResourceLimitSchema } from "~/common/resource-limit/server/schema/ResourceLimitSchema";

export const withResourceLimitQuery = withEntityQuery({
	logger: getRootLogger([
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
	keys() {
		return [
			"resource",
			"limit",
		];
	},
	toIdKey(id): ResourceLimitQuerySchema.Type {
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
