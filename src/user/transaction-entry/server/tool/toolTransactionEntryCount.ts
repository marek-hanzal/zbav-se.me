import { tool } from "@openai/agents";
import { getRootLogger } from "~/server/log/getRootLogger";
import { transactionEntryCountFn } from "~/user/transaction-entry/fn/transactionEntryCountFn";
import { TransactionEntryToolQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryToolQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolTransactionEntryCount",
]);

export const toolTransactionEntryCount = tool({
	name: "transaction-entry-count",
	needsApproval: false,
	description: `
Count transaction timeline/message entries matching the query.

Entry kind values:
- text: Plain message entry.
- gallery: Gallery/media entry.
- location: Location/address entry.
- package: Package/shipping entry.
- personal: Personal handover/contact entry.
- status-pending/status-open/status-resolved/status-dispute-buyer/status-dispute-seller/status-rejected-buyer/status-rejected-seller/status-sold/status-expired/status-success/status-closed: Status change entries.
    `.trim(),
	parameters: TransactionEntryToolQuerySchema.pick({
		filter: true,
	}),
	async execute(data) {
		logger.trace("toolTransactionEntryCount", {
			data,
		});

		const count = await transactionEntryCountFn({
			data,
		});

		const hasMore = await transactionEntryCountFn({
			data: {},
		});

		return {
			count: count,
			hasMore: hasMore > 0,
		} as const;
	},
});
