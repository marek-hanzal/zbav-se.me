import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import type { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";
import { transactionEntryGalleryFetchFn } from "~/user/transaction-entry/fn/transactionEntryGalleryFetchFn";
import type { TransactionEntryGalleryQuerySchema } from "~/user/transaction-entry/server/schema/TransactionEntryGalleryQuerySchema";

export const withTransactionEntryGalleryFetchQuery = withQuery<
	TransactionEntryGalleryQuerySchema.Type,
	GallerySchema.Type
>({
	logger: getRootLogger([
		"query",
		"withTransactionEntryGalleryFetchQuery",
	]),
	keys(data) {
		return [
			"transaction-entry",
			"gallery",
			"fetch",
			data,
		];
	},
	async queryFn(data) {
		return transactionEntryGalleryFetchFn({
			data,
		});
	},
});
