import { tool } from "@openai/agents-core";
import { match } from "ts-pattern";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { draftFetchFn } from "../../fn/draftFetchFn";

const logger = getRootLogger([
	"tool",
	"toolDraftDetail",
]);

const InputSchema = z
	.looseObject({
		draftId: z.string().min(1),
	})
	.strip();

export const toolDraftDetail = tool({
	name: "draft-detail",
	needsApproval: false,
	description: `
Fetch draft detail based on 'draftId'

- Don't invent your own 'draftId'
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolDraftDetail", {
			input,
		});

		const { draftId: id } = await InputSchema.parseAsync(input);

		return draftFetchFn({
			data: {
				where: {
					id,
				},
			},
		})
			.then((item) => {
				return `
Title: ${item.title ?? "not set"}
Price: ${item.price?.toFixed(2) ?? "not set"}
Price type: ${match(item.priceType)
					.with("open", () => "Accept offers")
					.with("closed", () => "Does not accept offers")
					.with("offer", () => "Offer a price")
					.with(null, () => "not set")
					.exhaustive()}

Images:
${item.withImageUrl.length > 0 ? item.withImageUrl.join("\n") : "not set"}

Description:
${item.description ?? "not set"}
                `.trim();
			})
			.catch(() => {
				return "nothing";
			});
	},
});
