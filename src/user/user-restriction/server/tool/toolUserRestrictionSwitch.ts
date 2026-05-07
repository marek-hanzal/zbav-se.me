import { tool } from "@openai/agents-core";
import { stringify } from "csv-stringify/sync";
import { DateTime } from "luxon";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { defaultLocale } from "~/locales";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import type { withRunnerMiddleware } from "~/user/agent/server/middleware/withRunnerMiddleware";
import { userRestrictionCollectionFn } from "../../fn/userRestrictionCollectionFn";
import { userRestrictionCreateFn } from "../../fn/userRestrictionCreateFn";

const logger = getRootLogger([
	"tool",
	"toolUserRestrictionSwitch",
]);

const InputSchema = z
	.looseObject({
		level: RestrictionEnumSchema,
	})
	.strip();

export const toolUserRestrictionSwitch = tool<typeof InputSchema, withRunnerMiddleware.Context>({
	name: "user-restriction-switch",
	needsApproval: false,
	description: `
Set a new restriction level for listings (content in general).

User must confirm you this action as switching to another level involves cooldown, so higher restriction levels
(adult and above) are not available immediately; user must acknowledge this.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input, context) {
		logger.trace("toolUserRestrictionSwitch", {
			input,
		});

		const { level: restriction } = await InputSchema.parseAsync(input);

		await userRestrictionCreateFn({
			data: {
				restriction,
			},
		});

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
