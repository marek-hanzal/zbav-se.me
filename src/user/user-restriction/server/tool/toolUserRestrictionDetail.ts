import { tool } from "@openai/agents-core";
import { stringify } from "csv-stringify/sync";
import { DateTime } from "luxon";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { defaultLocale } from "~/locales";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import type { withRunnerMiddleware } from "~/user/agent/server/middleware/withRunnerMiddleware";
import { userRestrictionCollectionFn } from "../../fn/userRestrictionCollectionFn";

const logger = getRootLogger([
	"tool",
	"toolUserRestrictionDetail",
]);

const InputSchema = z
	.looseObject({
		//
	})
	.strip();

export const toolUserRestrictionDetail = tool<typeof InputSchema, withRunnerMiddleware.Context>({
	name: "user-restriction-detail",
	needsApproval: false,
	description: `
Resolves current user restriction level.

- Use 'availableAt' as relative time to current timestamp ('now')
- Restriction levels are activated automatically, no further user action is needed
- Use human language instead of using restriction code itself

Available:
ready to use: this restriction level is already available and in use
waiting: this restriction level will be available (tell the user when)
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input, context) {
		logger.trace("toolUserRestrictionDetail", {
			input,
		});

		const _data = await InputSchema.parseAsync(input);

		const restrictions = await userRestrictionCollectionFn({
			data: {
				where: {
					isExpired: false,
				},
				sort: [
					{
						field: "availableAt",
						order: "asc",
					},
				],
			},
		});

		if (!restrictions.length) {
			return `
Not set, default: 'none'
            `.trim();
		}

		return stringify(
			restrictions.map((item) => ({
				restriction: item.restriction,
				availableAt: DateTime.fromJSDate(item.availableAt)
					.setLocale(context?.context.locale ?? defaultLocale)
					.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS),
				available: item.isAvailable ? "ready to use" : "waiting",
			})),
			{
				header: true,
				delimiter: "\t",
				columns: [
					"restriction",
					"availableAt",
					"available",
				],
			},
		);
	},
});
