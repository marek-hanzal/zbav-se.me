import { tool } from "@openai/agents";
import { match } from "ts-pattern";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { activityCollectionFn } from "~/user/activity/fn/activityCollectionFn";
import { activityCountFn } from "~/user/activity/fn/activityCountFn";
import { ActivityToolQuerySchema } from "~/user/activity/server/schema/ActivityToolQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolActivityCollection",
]);

const InputSchema = z
	.looseObject({
		type: z.enum([
			"count",
			"collection",
		]),
		query: ActivityToolQuerySchema,
	})
	.strip();

export const toolActivityCollection = tool({
	name: "activity-collection",
	needsApproval: false,
	description: `
Current user's activity items.

Modes:
- collection: return matching activity items
- count: return how many matching activity items exist

Use for notifications, unread-style activity, reactions, and transaction-related activity summaries.
Do not use for full trade message content.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolActivityCollection", {
			input,
		});

		const { type, query } = await InputSchema.parseAsync(input);

		return match(type)
			.with("count", async () => {
				const count = await activityCountFn({
					data: query,
				});

				const hasMore = await activityCountFn({
					data: {},
				});

				return {
					count: count,
					hasMore: hasMore > 0,
				} as const;
			})
			.with("collection", async () => {
				const items = await activityCollectionFn({
					data: {
						...query,
						limit: 64,
					},
				});

				return {
					count: items.length,
					items,
				} as const;
			})
			.exhaustive();
	},
});
