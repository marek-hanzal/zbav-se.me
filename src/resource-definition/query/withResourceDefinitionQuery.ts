import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withEntityQueryFn } from "~/query/fn/withEntityQueryFn";
import type { CountSchema } from "~/query/schema/CountSchema";
import { resourceDefinitionCollectionFn } from "~/resource-definition/fn/resourceDefinitionCollectionFn";
import { resourceDefinitionFetchFn } from "~/resource-definition/fn/resourceDefinitionFetchFn";
import type { ResourceDefinitionQuerySchema } from "~/resource-definition/schema/ResourceDefinitionQuerySchema";
import type { ResourceDefinitionSchema } from "~/resource-definition/schema/ResourceDefinitionSchema";

export const withResourceDefinitionQuery = withEntityQueryFn({
	logger: getRootLoggerFn([
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
	keysFn() {
		return [
			"common",
			"resource-definition",
		];
	},
	toIdKeyFn(id): ResourceDefinitionQuerySchema.Type {
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
