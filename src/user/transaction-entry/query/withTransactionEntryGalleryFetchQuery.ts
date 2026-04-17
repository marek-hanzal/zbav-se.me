import { getRootLogger } from "@/lib/client/log";
import { withQuery } from "@/lib/client/query";
import type { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";
import { transactionEntryGalleryFetchFn } from "~/user/transaction-entry/fn/transactionEntryGalleryFetchFn";
import type { TransactionEntryGalleryQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryGalleryQuerySchema";

const logger = getRootLogger([
	"query",
	"withTransactionEntryGalleryFetchQuery",
]);

export const withTransactionEntryGalleryFetchQuery = withQuery<
	TransactionEntryGalleryQuerySchema.Type,
	GallerySchema.Type
>({
	keys(data) {
		return [
			"transaction-entry",
			"gallery",
			"fetch",
			data,
		];
	},
	async queryFn(data) {
		logger.trace("queryFn", data);

		return transactionEntryGalleryFetchFn({
			data,
		});
	},
});
