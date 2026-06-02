import { withEntityQuery } from "@/lib/client/query";
import type { CountSchema } from "@/lib/common/schema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { locationFetchFn } from "~/session/location/fn/locationFetchFn";
import type { LocationQuerySchema } from "~/session/location/server/schema/LocationQuerySchema";
import type { LocationSchema } from "../server/schema/LocationSchema";

export const withLocationQuery = withEntityQuery({
	logger: getRootLogger([
		"query",
		"withLocationQuery",
	]),
	errors: {} as {
		collection: Error;
		count: Error;
		patch: Error;
		create: Error;
		delete: Error;
		patchCollection: Error;
		fetch: locationFetchFn.Error;
	},
	keys() {
		return [
			"location",
		];
	},
	toIdKey(id): LocationQuerySchema.Type {
		return {
			where: {
				id,
			},
		};
	},
	async fetchFn(data: LocationQuerySchema.Type) {
		return locationFetchFn({
			data,
		});
	},
	async countFn(_data: never): Promise<CountSchema.Type> {
		throw new Error("Location count is not supported.");
	},
	async collectionFn(_data: never): Promise<LocationSchema.Type[]> {
		throw new Error("Location create is not supported.");
	},
	async createFn(_data: never): Promise<LocationSchema.Type> {
		throw new Error("Location create is not supported.");
	},
	async deleteFn(_data: never): Promise<LocationSchema.Type> {
		throw new Error("Location delete is not supported.");
	},
	async patchFn(_data: never): Promise<LocationSchema.Type> {
		throw new Error("Location patch is not supported.");
	},
	async patchCollectionFn(_data: never): Promise<LocationSchema.Type[]> {
		throw new Error("Location collection patch is not supported.");
	},
});
