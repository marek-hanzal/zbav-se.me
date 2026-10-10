import { tool } from "@openai/agents";
import { feedDeleteFn } from "~/buyer-feed/fn/feedDeleteFn";
import { EntitySchema } from "~/entity/schema/EntitySchema";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";

const logger = getRootLoggerFn([
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
	parameters: InputSchema,
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
