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
	description: "User-bound activity items. Use small cursors and requested fields only.",
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
