import { withEntityQuery } from "@/lib/client/query";
import type { CountSchema } from "@/lib/common/schema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { userRestrictionCollectionFn } from "~/user/user-restriction/fn/userRestrictionCollectionFn";
import { userRestrictionCreateFn } from "~/user/user-restriction/fn/userRestrictionCreateFn";
import { userRestrictionFetchFn } from "~/user/user-restriction/fn/userRestrictionFetchFn";
import type { UserRestrictionCreateFnSchema } from "~/user/user-restriction/server/schema/UserRestrictionCreateFnSchema";
import type { UserRestrictionQuerySchema } from "~/user/user-restriction/server/schema/UserRestrictionQuerySchema";
import type { UserRestrictionSchema } from "~/user/user-restriction/server/schema/UserRestrictionSchema";

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
