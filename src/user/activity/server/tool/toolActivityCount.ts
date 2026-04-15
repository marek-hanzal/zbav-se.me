import { tool } from "@openai/agents";
import { getRootLogger } from "~/server/log/getRootLogger";
import { activityCountFn } from "~/user/activity/fn/activityCountFn";
import { ActivityToolQuerySchema } from "~/user/activity/server/schema/ActivityToolQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolActivityCount",
]);

export const toolActivityCount = tool({
	name: "activity-count",
	needsApproval: false,
	description: `
Count current user's activity/inbox items matching the query.

Activity family values:
- transaction: Activity related to a transaction or transaction message.
- reaction: Activity related to listing reactions such as favourite, flag, ignore, or thumb.

Activity type values:
- buyer-message: Buyer sent a message.
- seller-message: Seller sent a message.
- transaction: Generic transaction activity.
- system: System-generated activity.
- unknown: Fallback/unknown activity.
- thumb: Thumb/reaction activity.
- favourite: Listing was favourited.
- unfavourite: Listing was removed from favourites.
- flag: Listing was flagged.
- unflag: Listing flag was removed.
- ignore: Listing was ignored.
- unignore: Listing ignore was removed.

Priority values:
- common: Normal priority (e.g. interactions on listings).
- high: High priority (usually messages/transactions between users).
    `.trim(),
	parameters: ActivityToolQuerySchema.pick({
		filter: true,
	}),
	async execute(data) {
		logger.trace("toolActivityCount", {
			data,
		});

		const count = await activityCountFn({
			data,
		});

		const hasMore = await activityCountFn({
			data: {},
		});

		return {
			count: count,
			hasMore: hasMore > 0,
		} as const;
	},
});
