import { tool } from "@openai/agents-core";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import type { withRunnerMiddleware } from "~/user/agent/server/middleware/withRunnerMiddleware";

const logger = getRootLogger([
	"tool",
	"toolGalleryDetail",
]);

const InputSchema = z
	.looseObject({
		galleryId: z.string().meta({
			description: "galleryId to fetch detail of",
		}),
	})
	.strip();
type InputSchema = typeof InputSchema;

export const toolGalleryDetail = tool<InputSchema, withRunnerMiddleware.Context>({
	name: "gallery-detail",
	needsApproval: false,
	description: `
If you find 'galleryId' in the response, you can fetch detail here.

Response contains URL of gallery images.
	`.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolGalleryDetail", {
			input,
		});

		const data = InputSchema.parse(input);

		return "not yet";

		//         const gallery = await galleryFetchFn({

		//         })

		// 		return `
		// Datetime: ${stamp}
		// Localized: ${localized}
		//         `.trim();
	},
});
