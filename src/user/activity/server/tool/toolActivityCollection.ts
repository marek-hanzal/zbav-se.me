import { tool } from "@openai/agents";
import { getRootLogger } from "~/server/log/getRootLogger";
import { activityCollectionFn } from "~/user/activity/fn/activityCollectionFn";
import { ActivityQuerySchema } from "~/user/activity/server/schema/ActivityQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolActivityCollection",
]);

export const toolActivityCollection = tool({
	name: "activity-collection",
	needsApproval: false,
	description: `
        Current user's activity/inbox items. Use small cursors and compact filters only.

        Use for notifications, unread-style activity, reactions, and transaction-related activity summaries. For full transaction message content, use the appropriate transaction-entry-collection tool.

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
        - common: Normal priority.
        - high: High priority.

        Sort fields:
        - timestamp: Activity time.
        - archivedAt: Archive timestamp.
        - priority: Activity priority.
    `.trim(),
	parameters: ActivityQuerySchema,
	async execute(data) {
		logger.trace("toolActivityCollection", {
			data,
		});

		return activityCollectionFn({
			data: {
				...data,
				limit: 64,
			},
		});
	},
});
