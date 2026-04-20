import { tool } from "@openai/agents";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { uploadCreateFn } from "~/user/upload/fn/uploadCreateFn";
import { UploadToolCreateSchema } from "~/user/upload/server/schema/UploadToolCreateSchema";

const logger = getRootLogger([
	"tool",
	"toolUploadCreate",
]);

export const toolUploadCreate = tool({
	name: "upload-create",
	needsApproval: false,
	description: `
Create a new upload record from a public URL.

Use when:
- The user wants to save/create an upload record
- You have a public URL to a file (image, document, etc.)
- The URL must be publicly accessible

Returns the upload record with id and URL.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(UploadToolCreateSchema),
	async execute(data) {
		logger.trace("toolUploadCreate", {
			data,
		});

		return uploadCreateFn({
			data,
		});
	},
});
