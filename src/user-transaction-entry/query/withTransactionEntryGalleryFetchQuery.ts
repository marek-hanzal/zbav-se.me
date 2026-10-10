import { getRootLogger } from "~/log/fn/getRootLogger";
import { withQuery } from "~/query/fn/withQuery";
import type { GallerySchema } from "~/user-gallery/schema/GallerySchema";
import { transactionEntryGalleryFetchFn } from "~/user-transaction-entry/fn/transactionEntryGalleryFetchFn";
import type { TransactionEntryGalleryQuerySchema } from "~/user-transaction-entry/schema/TransactionEntryGalleryQuerySchema";

export const withTransactionEntryGalleryFetchQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withTransactionEntryGalleryFetchQuery",
	]),
	errors: {} as {
		query: transactionEntryGalleryFetchFn.Error;
	},
	keys(data: TransactionEntryGalleryQuerySchema.Type) {
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
