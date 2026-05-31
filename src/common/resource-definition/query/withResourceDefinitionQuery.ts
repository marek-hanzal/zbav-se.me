import { withEntityQuery } from "@/lib/client/query";
import type { CountSchema } from "@/lib/common/schema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { resourceDefinitionCollectionFn } from "~/common/resource-definition/fn/resourceDefinitionCollectionFn";
import { resourceDefinitionFetchFn } from "~/common/resource-definition/fn/resourceDefinitionFetchFn";
import type { ResourceDefinitionQuerySchema } from "~/common/resource-definition/server/schema/ResourceDefinitionQuerySchema";
import type { ResourceDefinitionSchema } from "~/common/resource-definition/server/schema/ResourceDefinitionSchema";

export const withResourceDefinitionQuery = withEntityQuery({
	logger: getRootLogger([
		"query",
		"withResourceDefinitionQuery",
	]),
	errors: {} as {
		fetch: resourceDefinitionFetchFn.Error;
		collection: resourceDefinitionCollectionFn.Error;
		count: Error;
		patch: Error;
		create: Error;
		delete: Error;
		patchCollection: Error;
	},
	keys() {
		return [
			"common",
			"resource-definition",
		];
	},
	toIdKey(id): ResourceDefinitionQuerySchema.Type {
		return {
			where: {
				name: id as ResourceDefinitionSchema.Type["name"],
			},
		};
	},
	async fetchFn(data: ResourceDefinitionQuerySchema.Type) {
		return resourceDefinitionFetchFn({
			data,
		});
	},
	async collectionFn(data: ResourceDefinitionQuerySchema.Type) {
		return resourceDefinitionCollectionFn({
			data,
		});
	},
	async countFn(_data: never): Promise<CountSchema.Type> {
		throw new Error("Resource definition count is not supported.");
	},
	async createFn(_data: never): Promise<ResourceDefinitionSchema.Type> {
		throw new Error("Resource definition create is not supported.");
	},
	async deleteFn(_data: never): Promise<ResourceDefinitionSchema.Type> {
		throw new Error("Resource definition delete is not supported.");
	},
	async patchFn(_data: never): Promise<ResourceDefinitionSchema.Type> {
		throw new Error("Resource definition patch is not supported.");
	},
	async patchCollectionFn(_data: never): Promise<ResourceDefinitionSchema.Type[]> {
		throw new Error("Resource definition collection patch is not supported.");
	},
});
