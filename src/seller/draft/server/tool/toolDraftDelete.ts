import { tool } from "@openai/agents";
import z from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { draftDeleteFn } from "~/seller/draft/fn/draftDeleteFn";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolDraftDelete",
]);

const InputSchema = z
	.looseObject({
		draftId: z.string().min(1),
	})
	.strip();

export const toolDraftDelete = tool({
	name: "draft-delete",
	needsApproval: false,
	description: `
Delete saved listing drafts selected by a narrow query.

- Use this tool only when explicitly asked for or confirmed by the user
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolDraftDelete", {
			input,
		});

		const { draftId: id } = await InputSchema.parseAsync(input);

		await draftDeleteFn({
			data: {
				where: {
					id,
				},
			},
		});

		return "ok";
	},
});
