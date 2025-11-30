import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withGallerySelect } from "~/@user/gallery/db/withGallerySelect";
import type { WithDatabase } from "~/database/WithDatabase";
import type { ListingTransactionGallerySortSchema } from "../schema/ListingTransactionGallerySortSchema";

export namespace withListingTransactionGallerySelect {
	export interface Props {
		database: WithDatabase;
		sort: ListingTransactionGallerySortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingTransactionGallerySelect>;
}

export const withListingTransactionGallerySelect = ({
	database,
	sort,
}: withListingTransactionGallerySelect.Props) => {
	let query = database
		.selectFrom("listing_transaction_gallery as ltg")
		.selectAll()
		.select(sql<"gallery">`'gallery'`.as("event"))
		.select((eb) =>
			jsonObjectFrom(
				withGallerySelect({
					database,
					sort: undefined,
				})
					.whereRef("gal.id", "in", eb.ref("ltg.galleryId"))
					.limit(1),
			)
				.$notNull()
				.as("gallery"),
		);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("ltg.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
