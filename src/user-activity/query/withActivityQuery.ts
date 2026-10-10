import { getRootLogger } from "~/log/fn/getRootLogger";
import { withEntityQuery } from "~/query/fn/withEntityQuery";
import { activityCollectionFn } from "~/user-activity/fn/activityCollectionFn";
import { activityCountFn } from "~/user-activity/fn/activityCountFn";
import { activityFetchFn } from "~/user-activity/fn/activityFetchFn";
import { activityPatchCollectionFn } from "~/user-activity/fn/activityPatchCollectionFn";
import { activityPatchFn } from "~/user-activity/fn/activityPatchFn";
import type { ActivityCountQuerySchema } from "~/user-activity/schema/ActivityCountQuerySchema";
import type { ActivityPatchCollectionSchema } from "~/user-activity/schema/ActivityPatchCollectionSchema";
import type { ActivityPatchSchema } from "~/user-activity/schema/ActivityPatchSchema";
import type { ActivityQuerySchema } from "~/user-activity/schema/ActivityQuerySchema";
import type { ActivitySchema } from "~/user-activity/schema/ActivitySchema";

export const withActivityQuery = withEntityQuery({
	logger: getRootLogger([
		"query",
		"withActivityQuery",
	]),
	errors: {} as {
		fetch: activityFetchFn.Error;
		collection: activityCollectionFn.Error;
		count: activityCountFn.Error;
		patch: activityPatchFn.Error;
		create: Error;
		delete: Error;
		patchCollection: activityPatchCollectionFn.Error;
	},
	keys() {
		return [
			"activity",
		];
	},
	toIdKey(id): ActivityQuerySchema.Type {
		return {
			where: {
				id,
			},
		};
	},
	async fetchFn(data: ActivityQuerySchema.Type) {
		return activityFetchFn({
			data,
		});
	},
	async collectionFn(data: ActivityQuerySchema.Type) {
		return activityCollectionFn({
			data,
		});
	},
	async countFn(data: ActivityCountQuerySchema.Type) {
		return activityCountFn({
			data,
		});
	},
	async createFn(_data: never): Promise<ActivitySchema.Type> {
		throw new Error("Activity create is not supported.");
	},
	async deleteFn(_data: never): Promise<ActivitySchema.Type> {
		throw new Error("Activity delete is not supported.");
	},
	async patchFn(data: ActivityPatchSchema.Type) {
		return activityPatchFn({
			data,
		});
	},
	async patchCollectionFn(data: ActivityPatchCollectionSchema.Type) {
		return activityPatchCollectionFn({
			data,
		});
	},
});
