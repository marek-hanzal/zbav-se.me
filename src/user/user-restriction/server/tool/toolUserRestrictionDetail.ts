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
- 'isActive' === true - restriction level is available to use
- 'isActive' === false - restriction level is not available yet, present 'availableAt' when it will be available
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
				isActive: item.isAvailable,
			})),
			{
				header: true,
				delimiter: "\t",
				columns: [
					"restriction",
					"availableAt",
					"isActive",
				],
			},
		);
	},
});
