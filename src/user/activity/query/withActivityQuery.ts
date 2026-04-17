import { getRootLogger } from "@/lib/client/log";
import { withEntityQuery } from "@/lib/client/query";
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

const logger = getRootLogger([
	"query",
	"withActivityQuery",
]);

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
	keys: () => [
		"activity",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data, context) {
		logger.trace("fetchFn", {
			data,
			context,
		});

		return activityFetchFn({
			data,
		});
	},
	async collectionFn(data, context) {
		logger.trace("collectionFn", {
			data,
			context,
		});

		return activityCollectionFn({
			data,
		});
	},
	async countFn(data, context) {
		logger.trace("countFn", {
			data,
			context,
		});

		return activityCountFn({
			data,
		});
	},
	async createFn(_data, _context) {
		throw new Error("Activity create is not supported.");
	},
	async deleteFn(_data, _context) {
		throw new Error("Activity delete is not supported.");
	},
	async patchFn(data, context) {
		logger.trace("patchFn", {
			data,
			context,
		});

		return activityPatchFn({
			data,
		});
	},
	async patchCollectionFn(data, context) {
		logger.trace("patchCollectionFn", {
			data,
			context,
		});

		return activityPatchCollectionFn({
			data,
		});
	},
});
