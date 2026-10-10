import { getRootLogger } from "~/log/fn/getRootLogger";
import { withEntityQuery } from "~/query/fn/withEntityQuery";
import type { CountSchema } from "~/query/schema/CountSchema";
import { userRestrictionCollectionFn } from "~/user-restriction/fn/userRestrictionCollectionFn";
import { userRestrictionCreateFn } from "~/user-restriction/fn/userRestrictionCreateFn";
import { userRestrictionFetchFn } from "~/user-restriction/fn/userRestrictionFetchFn";
import type { UserRestrictionCreateFnSchema } from "~/user-restriction/schema/UserRestrictionCreateFnSchema";
import type { UserRestrictionQuerySchema } from "~/user-restriction/schema/UserRestrictionQuerySchema";
import type { UserRestrictionSchema } from "~/user-restriction/schema/UserRestrictionSchema";

export const withUserRestrictionQuery = withEntityQuery({
	logger: getRootLogger([
		"query",
		"withUserRestrictionQuery",
	]),
	errors: {} as {
		fetch: userRestrictionFetchFn.Error;
		collection: userRestrictionCollectionFn.Error;
		count: Error;
		patch: Error;
		create: userRestrictionCreateFn.Error;
		delete: Error;
		patchCollection: Error;
	},
	keys() {
		return [
			"user",
			"restriction",
		];
	},
	toIdKey(id): UserRestrictionQuerySchema.Type {
		return {
			where: {
				id,
			},
		};
	},
	async fetchFn(data: UserRestrictionQuerySchema.Type) {
		return userRestrictionFetchFn({
			data,
		});
	},
	async collectionFn(data: UserRestrictionQuerySchema.Type) {
		return userRestrictionCollectionFn({
			data,
		});
	},
	async countFn(_data: never): Promise<CountSchema.Type> {
		throw new Error("User restriction count is not supported.");
	},
	async createFn(data: UserRestrictionCreateFnSchema.Type) {
		return userRestrictionCreateFn({
			data,
		});
	},
	async patchFn(_data: never): Promise<UserRestrictionSchema.Type> {
		throw new Error("User restriction patch is not supported.");
	},
	async patchCollectionFn(_data: never): Promise<UserRestrictionSchema.Type[]> {
		throw new Error("User restriction collection patch is not supported.");
	},
	async deleteFn(_data: never): Promise<UserRestrictionSchema.Type> {
		throw new Error("User restriction delete is not supported.");
	},
});
