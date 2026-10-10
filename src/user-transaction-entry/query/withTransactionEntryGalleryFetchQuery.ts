import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";
import type { GallerySchema } from "~/user-gallery/schema/GallerySchema";
import { transactionEntryGalleryFetchFn } from "~/user-transaction-entry/fn/transactionEntryGalleryFetchFn";
import type { TransactionEntryGalleryQuerySchema } from "~/user-transaction-entry/schema/TransactionEntryGalleryQuerySchema";

export const withTransactionEntryGalleryFetchQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withTransactionEntryGalleryFetchQuery",
	]),
	errors: {} as {
		query: transactionEntryGalleryFetchFn.Error;
	},
	keysFn(data: TransactionEntryGalleryQuerySchema.Type) {
		return [
			"transaction-entry",
			"gallery",
			"fetch",
			data,
		];
	},
	async queryFn(data: TransactionEntryGalleryQuerySchema.Type): Promise<GallerySchema.Type> {
		return transactionEntryGalleryFetchFn({
			data,
		});
	},
});
