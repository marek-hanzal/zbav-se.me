import { withQuery } from "@use-pico/client/query";
import type { GallerySchema } from "~/client/@user/gallery/server/schema/GallerySchema";
import { transactionEntryGalleryFetchFn } from "~/client/@user/transaction-entry/server/fn/transactionEntryGalleryFetchFn";
import type { TransactionEntryGalleryQuerySchema } from "~/client/@user/transaction-entry/server/schema/TransactionEntryGalleryQuerySchema";

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
