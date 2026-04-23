import { tool } from "@openai/agents";
import { z } from "zod";
import { feedCollectionFn } from "~/buyer/feed/fn/feedCollectionFn";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolFeedCollection",
]);

const InputSchema = z
	.looseObject({
		//
	})
	.strip();

export const toolFeedCollection = tool({
	name: "feed-collection",
	needsApproval: false,
	description: `
Current user's saved feeds.

Modes:
- collection: return a small page of matching feeds
- count: return how many matching feeds exist

Use only user-facing feeds (type: user), not internal search feeds (type: search).
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolFeedCollection", {
			input,
		});

		const { type } = await InputSchema.parseAsync(input);

		const items = await feedCollectionFn({
			data: {
				//
				limit: 4,
			},
		});

		if (!items.length) {
			return "nothing";
		}

		return "not yet";
	},
});
