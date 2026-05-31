import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { userResourceLimitCollectionFn } from "~/user/user-resource/fn/userResourceLimitCollectionFn";
import { userResourceLimitCountFn } from "~/user/user-resource/fn/userResourceLimitCountFn";
import { userResourceLimitFetchFn } from "~/user/user-resource/fn/userResourceLimitFetchFn";
import type { UserResourceLimitCountQuerySchema } from "~/user/user-resource/server/schema/UserResourceLimitCountQuerySchema";
import type { UserResourceLimitQuerySchema } from "~/user/user-resource/server/schema/UserResourceLimitQuerySchema";
import type { UserResourceLimitSchema } from "~/user/user-resource/server/schema/UserResourceLimitSchema";

export const withUserResourceLimitQuery = withEntityQuery({
	logger: getRootLogger([
		"query",
		"withUserResourceLimitQuery",
	]),
	errors: {} as {
		fetch: userResourceLimitFetchFn.Error;
		collection: userResourceLimitCollectionFn.Error;
		count: userResourceLimitCountFn.Error;
		patch: Error;
		create: Error;
		delete: Error;
		patchCollection: Error;
	},
	keys() {
		return [
			"user",
			"resource-limit",
		];
	},
	toIdKey(id): UserResourceLimitQuerySchema.Type {
		return {
			where: {
				id,
			},
		};
	},
	async fetchFn(data: UserResourceLimitQuerySchema.Type) {
		return userResourceLimitFetchFn({
			data,
		});
	},
	async collectionFn(data: UserResourceLimitQuerySchema.Type) {
		return userResourceLimitCollectionFn({
			data,
		});
	},
	async countFn(data: UserResourceLimitCountQuerySchema.Type) {
		return userResourceLimitCountFn({
			data,
		});
	},
	async createFn(_data: never): Promise<UserResourceLimitSchema.Type> {
		throw new Error("User resource limit create is not supported.");
	},
	async patchFn(_data: never): Promise<UserResourceLimitSchema.Type> {
		throw new Error("User resource limit patch is not supported.");
	},
	async patchCollectionFn(_data: never): Promise<UserResourceLimitSchema.Type[]> {
		throw new Error("User resource limit collection patch is not supported.");
	},
	async deleteFn(_data: never): Promise<UserResourceLimitSchema.Type> {
		throw new Error("User resource limit delete is not supported.");
	},
});
