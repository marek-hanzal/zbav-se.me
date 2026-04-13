import { tool } from "@openai/agents";
import { getRootLogger } from "~/server/log/getRootLogger";
import { inboxCollectionFn } from "~/user/inbox/fn/inboxCollectionFn";
import { InboxQuerySchema } from "~/user/inbox/server/schema/InboxQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolInboxCollection",
]);

export const toolInboxCollection = tool({
	name: "inbox-collection",
	needsApproval: false,
	description: "User-bound inbox items. Use small cursors and requested fields only.",
	parameters: InboxQuerySchema,
	async execute(data) {
		logger.trace("toolInboxCollection", {
			data,
		});

		return inboxCollectionFn({
			data: {
				...data,
				limit: 64,
			},
		});
	},
});
