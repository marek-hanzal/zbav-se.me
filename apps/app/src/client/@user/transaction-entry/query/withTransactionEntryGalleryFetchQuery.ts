import { withQuery } from "@use-pico/client/query";
import type { GallerySchema } from "~/server/@user/gallery/schema/GallerySchema";
import { transactionEntryGalleryFetchFn } from "~/server/@user/transaction-entry/fn/transactionEntryGalleryFetchFn";
import type { TransactionEntryGalleryQuerySchema } from "~/server/@user/transaction-entry/schema/TransactionEntryGalleryQuerySchema";

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
		return transactionEntryGalleryFetchFn({
			data,
		});
	},
});
