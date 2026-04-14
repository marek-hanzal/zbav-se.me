import { tool } from "@openai/agents";
import { getRootLogger } from "~/server/log/getRootLogger";
import { transactionEntryCollectionFn } from "~/user/transaction-entry/fn/transactionEntryCollectionFn";
import { TransactionEntryQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolTransactionEntryCollection",
]);

export const toolTransactionEntryCollection = tool({
	name: "seller-transaction-entry-collection",
	needsApproval: false,
	description: `
        Seller-side transaction timeline/message entries. Use small cursors and compact filters only.

        Use this when the user asks about message content, timeline content, package/location/personal exchange data, or status history inside a transaction. Prefer an exact transactionId.

        Entry kind values:
        - text: Plain message entry.
        - gallery: Gallery/media entry.
        - location: Location/address entry.
        - package: Package/shipping entry.
        - personal: Personal handover/contact entry.
        - status-pending: Transaction became pending.
        - status-open: Transaction became open/accepted.
        - status-resolved: Seller resolved the transaction.
        - status-dispute-buyer: Buyer opened dispute.
        - status-dispute-seller: Seller opened dispute.
        - status-rejected-buyer: Buyer rejected/closed the transaction.
        - status-rejected-seller: Seller rejected/closed the transaction.
        - status-sold: Transaction was marked sold.
        - status-expired: Transaction expired.
        - status-success: Buyer confirmed success.
        - status-closed: Transaction was closed without success/rejection.

        Sort fields:
        - id: Entry id order.
        - createdAt: Entry creation time.
    `.trim(),
	parameters: TransactionEntryQuerySchema,
	async execute(data) {
		logger.trace("toolTransactionEntryCollection", {
			data,
		});

		const items = await transactionEntryCollectionFn({
			data: {
				...data,
				limit: 8,
			},
		});

		return {
			count: items.length,
			items,
		};
	},
});
