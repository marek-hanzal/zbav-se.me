import { tool } from "@openai/agents";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { transactionEntryCreateFn } from "~/user/transaction-entry/fn/transactionEntryCreateFn";
import { TransactionEntryCreateSchema } from "~/user/transaction-entry/server/schema/TransactionEntryCreateSchema";

const logger = getRootLogger([
	"tool",
	"toolTransactionEntryCreate",
]);

const InputSchema = z
	.looseObject({
		transactionId: z.string().meta({
			description: "Exact transaction identifier to append the entry to",
		}),
		kind: z.enum([
			"text",
			"gallery",
			"location",
			"package",
			"personal",
		]),
		payload: z
			.looseObject({
				text: z.string().optional().meta({
					description: "Required for text entries",
				}),
				uploadIds: z.array(z.string()).optional().meta({
					description: "Required for gallery entries; ordered upload identifiers",
				}),
				locationId: z.string().optional().meta({
					description: "Required for location entries and personal entries",
				}),
				link: z.url().optional().meta({
					description: "Required for package entries; tracking URL",
				}),
				number: z.string().nullable().optional().meta({
					description: "Package tracking number, or null when unknown",
				}),
				name: z.string().optional().meta({
					description: "Required for personal entries; contact name",
				}),
				phone: z.string().optional().meta({
					description: "Required for personal entries; contact phone",
				}),
				email: z.email().optional().meta({
					description: "Required for personal entries; contact email",
				}),
			})
			.strip(),
	})
	.strip();

export const toolTransactionEntryCreate = tool({
	name: "transaction-entry-create",
	needsApproval: false,
	description: `
Send a message to transactionId participant (during trade on a listing).

Kind:
gallery - use, if user provided an image and asks to send it
location - use if user provides an address (location) (e.g. package / meeting point)
package - use if user provided package tracking code / url
personal - use if user provided you any of: name / phone / email
text - if none of other kinds matches, use plain text (last chance)
	`.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolTransactionEntryCreate", {
			data: input,
		});

		const data = await InputSchema.parseAsync(input);

		const transactionEntry = await transactionEntryCreateFn({
			data: TransactionEntryCreateSchema.parse(data),
		});

		return `transactionEntryId ${transactionEntry.id}`;
	},
});
