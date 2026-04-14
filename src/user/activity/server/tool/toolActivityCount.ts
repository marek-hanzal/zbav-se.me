import { tool } from "@openai/agents";
import { getRootLogger } from "~/server/log/getRootLogger";
import { activityCountFn } from "~/user/activity/fn/activityCountFn";
import { ActivityCountQuerySchema } from "~/user/activity/server/schema/ActivityCountQuerySchema";

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

        Activity type values: buyer-message, seller-message, transaction, system, unknown, thumb, favourite, unfavourite, flag, unflag, ignore, unignore.

        Priority values:
        - common: Normal priority.
        - high: High priority.
    `.trim(),
	parameters: ActivityCountQuerySchema,
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
