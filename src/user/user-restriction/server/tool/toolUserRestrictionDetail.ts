import { tool } from "@openai/agents-core";
import { stringify } from "csv-stringify/sync";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
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

export const toolUserRestrictionDetail = tool({
	name: "user-restriction-detail",
	needsApproval: false,
	description: `
Resolves current user restriction level.

- Use 'availableAt' as relative time to current timestamp ('now')

Available:
ready to use: this restriction level is already available and in use
waiting: this restriction level will be available (tell the user when)
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
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
				availableAt: item.availableAt.toISOString(),
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
