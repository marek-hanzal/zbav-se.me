import { tool } from "@openai/agents";
import { z } from "zod";
import { feedPatchFn } from "~/buyer/feed/fn/feedPatchFn";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolFeedPatch",
]);

const InputSchema = z
	.looseObject({
		feedId: z.string().meta({
			description: "'feedId' resolved from other tools",
		}),
		patch: z
			.looseObject({
				uploadId: z.string().optional().meta({
					description: "Update hero image of the feed",
				}),
			})
			.strip(),
	})
	.strip();

export const toolFeedPatch = tool({
	name: "feed-patch",
	needsApproval: false,
	description: `
Update an existing feed.

You need 'feedId' from other tools to proceed here.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolFeedPatch", {
			input,
		});

		const { feedId, patch } = await InputSchema.parseAsync(input);

		await feedPatchFn({
			data: {
				patch,
				query: {
					where: {
						id: feedId,
						type: "user",
					},
				},
			},
		});

		return "ok";
	},
});
