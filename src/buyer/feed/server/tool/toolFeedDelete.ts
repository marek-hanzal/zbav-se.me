import { tool } from "@openai/agents";
import { EntitySchema } from "@/lib/common/schema";
import { feedDeleteFn } from "~/buyer/feed/fn/feedDeleteFn";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolFeedDelete",
]);

const InputSchema = EntitySchema;

export const toolFeedDelete = tool({
	name: "feed-delete",
	needsApproval: false,
	description: `
Delete single saved listing search selected by a query.

- Use 'feedId'
- Don't invent your own 'feedId'
- Use this tool only if user explicitly asked to do so
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolFeedDelete", {
			input,
		});

		const { id } = await InputSchema.parseAsync(input);

		await feedDeleteFn({
			data: {
				where: {
					id,
					type: "user",
				},
			},
		});

		return "ok";
	},
});
