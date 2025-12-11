import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withGallerySelect } from "~/@user/gallery/db/withGallerySelect";
import type { WithDatabase } from "~/database/WithDatabase";
import type { TransactionGallerySortSchema } from "../schema/TransactionGallerySortSchema";

export namespace withTransactionGallerySelect {
	export interface Props {
		database: WithDatabase;
		sort: TransactionGallerySortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withTransactionGallerySelect>;
}

export const withTransactionGallerySelect = ({
	database,
	sort,
}: withTransactionGallerySelect.Props) => {
	let query = database
		.selectFrom("transaction_gallery as ltg")
		.selectAll()
		.select(sql<"gallery">`'gallery'`.as("event"))
		.select((eb) =>
			jsonObjectFrom(
				withGallerySelect({
					database,
					sort: undefined,
				})
					.whereRef("gal.id", "=", eb.ref("ltg.galleryId"))
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
