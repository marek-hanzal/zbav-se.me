import { tool } from "@openai/agents-core";
import { DateTime } from "luxon";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import type { withRunnerMiddleware } from "~/user/agent/server/middleware/withRunnerMiddleware";

const logger = getRootLogger([
	"tool",
	"toolNow",
]);

const InputSchema = z.looseObject({}).strip().meta({
	description: "No input",
});
type InputSchema = typeof InputSchema;

export const toolNow = tool<InputSchema, withRunnerMiddleware.Context>({
	name: "now",
	needsApproval: false,
	description: `
Current date-time
	`.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input, context) {
		logger.trace("toolNow", {
			input,
		});

		const now = DateTime.now().setLocale(context?.context.locale ?? "en");
		const stamp = now.toISO();
		const localized = now.toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS);

		return `
Datetime: ${stamp}
Localized: ${localized}
        `.trim();
	},
});
