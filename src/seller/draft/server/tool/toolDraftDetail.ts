import { tool } from "@openai/agents-core";
import { match } from "ts-pattern";
import { EntitySchema } from "@/lib/common/schema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { draftFetchFn } from "../../fn/draftFetchFn";

const logger = getRootLogger([
	"tool",
	"toolDraftDetail",
]);

const InputSchema = EntitySchema;

export const toolDraftDetail = tool({
	name: "draft-detail",
	needsApproval: false,
	description: `
...
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolDraftDetail", {
			input,
		});

		const { id } = await InputSchema.parseAsync(input);

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
${item.gallery.items.length > 0 ? item.gallery.items.map((item) => item.upload.url) : "not set"}

Description:
${item.description ?? "not set"}
                `.trim();
			})
			.catch(() => {
				return "nothing";
			});
	},
});
