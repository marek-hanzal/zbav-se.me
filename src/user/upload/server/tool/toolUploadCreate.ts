import { tool } from "@openai/agents";
import { z } from "zod";
import { AccessEnumSchema } from "~/common/access/AccessEnumSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { uploadCreateFn } from "~/user/upload/fn/uploadCreateFn";

const logger = getRootLogger([
	"tool",
	"toolUploadCreate",
]);

const InputSchema = z
	.looseObject({
		url: z.url().meta({
			description: "Public URL to the uploaded file",
		}),
		access: AccessEnumSchema.meta({
			description: "Visibility of the upload",
		}),
	})
	.strip();

export const toolUploadCreate = tool({
	name: "upload-create",
	needsApproval: false,
	description: `
Create a new upload record from a public URL.

Use when:
- The user wants to save/create an upload record
- You have a public URL to a file (image, document, etc.)
- The URL must be publicly accessible

Access:
- public: for listings only
- protected: when sharing uploads between users (e.g. transactions/transaction-entry)
- private: for user private stuff (e.g. drafts)
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolUploadCreate", {
			data: input,
		});

		const data = await InputSchema.parseAsync(input);

		const { id } = await uploadCreateFn({
			data,
		});

		return `uploadId ${id}`;
	},
});
