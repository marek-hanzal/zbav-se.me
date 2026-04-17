import { withEntityQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { activityCollectionFn } from "~/user/activity/fn/activityCollectionFn";
import { activityCountFn } from "~/user/activity/fn/activityCountFn";
import { activityFetchFn } from "~/user/activity/fn/activityFetchFn";
import { activityPatchCollectionFn } from "~/user/activity/fn/activityPatchCollectionFn";
import { activityPatchFn } from "~/user/activity/fn/activityPatchFn";
import type { ActivityCountQuerySchema } from "~/user/activity/server/schema/ActivityCountQuerySchema";
import type { ActivityPatchCollectionSchema } from "~/user/activity/server/schema/ActivityPatchCollectionSchema";
import type { ActivityPatchSchema } from "~/user/activity/server/schema/ActivityPatchSchema";
import type { ActivityQuerySchema } from "~/user/activity/server/schema/ActivityQuerySchema";
import type { ActivitySchema } from "~/user/activity/server/schema/ActivitySchema";

export const withActivityQuery = withEntityQuery<
	ActivitySchema.Type,
	ActivityQuerySchema.Type,
	ActivityQuerySchema.Type,
	ActivityCountQuerySchema.Type,
	ActivityPatchSchema.Type,
	never,
	never,
	ActivityPatchCollectionSchema.Type
>({
	logger: getRootLogger([
		"query",
		"withActivityQuery",
	]),
	keys: () => [
		"activity",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		return activityFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		return activityCollectionFn({
			data,
		});
	},
	async countFn(data) {
		return activityCountFn({
			data,
		});
	},
	async createFn(_data) {
		throw new Error("Activity create is not supported.");
	},
	async deleteFn(_data) {
		throw new Error("Activity delete is not supported.");
	},
	async patchFn(data) {
		return activityPatchFn({
			data,
		});
	},
	async patchCollectionFn(data) {
		return activityPatchCollectionFn({
			data,
		});
	},
});
