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
	description: "Count user-bound activity items.",
	parameters: ActivityCountQuerySchema,
	async execute(data) {
		logger.trace("toolActivityCount", {
			data,
		});

		return activityCountFn({
			data,
		});
	},
});
