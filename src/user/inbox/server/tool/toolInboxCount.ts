import { tool } from "@openai/agents";
import { getRootLogger } from "~/server/log/getRootLogger";
import { inboxCountFn } from "~/user/inbox/fn/inboxCountFn";
import { InboxCountQuerySchema } from "~/user/inbox/server/schema/InboxCountQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolInboxCount",
]);

export const toolInboxCount = tool({
	name: "inbox-count",
	needsApproval: false,
	description: "Count user-bound inbox items.",
	parameters: InboxCountQuerySchema,
	async execute(data) {
		logger.trace("toolInboxCount", {
			data,
		});

		return inboxCountFn({
			data,
		});
	},
});
