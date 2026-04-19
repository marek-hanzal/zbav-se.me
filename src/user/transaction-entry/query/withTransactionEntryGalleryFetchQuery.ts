import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import type { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";
import { transactionEntryGalleryFetchFn } from "~/user/transaction-entry/fn/transactionEntryGalleryFetchFn";
import type { TransactionEntryGalleryQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryGalleryQuerySchema";

export const withTransactionEntryGalleryFetchQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withTransactionEntryGalleryFetchQuery",
	]),
	errors: {} as {
		query: transactionEntryGalleryFetchFn.Error;
	},
	keys(data) {
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
