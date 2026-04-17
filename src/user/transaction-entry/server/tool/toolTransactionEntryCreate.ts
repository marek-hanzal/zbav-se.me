import { tool } from "@openai/agents";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { transactionEntryCreateFn } from "~/user/transaction-entry/fn/transactionEntryCreateFn";
import { TransactionEntryCreateSchema } from "~/user/transaction-entry/server/schema/TransactionEntryCreateSchema";

const logger = getRootLogger([
	"tool",
	"toolTransactionEntryCreate",
]);

const TransactionEntryCreateToolSchema = z
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
Create a user-authored transaction timeline entry for the current user.

Use this only when the user clearly wants to send, share, or add something to an existing transaction conversation. Requires an exact
transactionId. If the user only references "that order", "the buyer", "the seller", or a listing, first find the correct transaction with
buyer/seller transaction collection tools and then use the resolved transactionId.

Allowed user-authored entry kinds:
- text: Normal message. Use for plain chat content. Preserve the user's meaning; do not invent commitments, prices, contact details,
  or shipping promises.
- gallery: Share uploaded media. Use only when uploadIds already exist. Keep uploadIds in the user's intended order.
- location: Share a location/address. Use only with a concrete locationId; if the user gives a human address, normalize it with
  the location tool first.
- personal: Share handover/contact details. Use only when the user explicitly provided name, phone, email, and location.
  Normalize the location to locationId first.
- package: Share shipping/tracking details. Seller-only. Requires a valid tracking link. Use number when known, otherwise set
  number to null.

Structured message priority:
- Prefer location, package, personal, and gallery whenever the user's intent matches those structured kinds.
- Use text only for plain chat that does not fit a structured kind.
- If a structured kind is appropriate but required data is missing, ask the user for the missing data instead of sending a text fallback.
- Do not convert addresses, tracking data, contact details, or uploaded media into a text message when a structured entry can
  represent them.

Transaction-state rules before using this:
- Prefer fetching the transaction first when status or user side is unknown.
- In open transactions, buyer and seller may create text, gallery, location, and personal entries; only seller may create package entries.
- In dispute transactions, buyer and seller may create text, gallery, location, and personal entries; only seller may create
  package entries.
- In resolved transactions, only the buyer may create a text entry.
- Do not use for pending, sold, rejected, expired, success, or closed transactions.
- Do not use this tool for status-* timeline entries. Status entries are created by transaction lifecycle actions, not by the assistant.

This writes to the transaction timeline and notifies the other participant, so do not call it for drafts, previews, suggestions,
or when required fields are uncertain.
	`.trim(),
	parameters: TransactionEntryCreateToolSchema,
	async execute(data) {
		logger.trace("toolTransactionEntryCreate", {
			data,
		});

		return transactionEntryCreateFn({
			data: TransactionEntryCreateSchema.parse(data),
		});
	},
});
