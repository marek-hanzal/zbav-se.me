import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withTransactionListingSourceSelectFx } from "~/@seller-user/transaction-listing/db/withTransactionListingSourceSelectFx";
import { withGallerySelectFx } from "~/@user/gallery/db/withGallerySelectFx";

export namespace withTransactionListingSelectFx {
	export interface Props extends withTransactionListingSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withTransactionListingSelectFx>>;
}

export const withTransactionListingSelectFx = Effect.fn("withTransactionListingSelectFx")(
	function* ({ sort }: withTransactionListingSelectFx.Props) {
		const sourceSelect = yield* withTransactionListingSourceSelectFx({
			sort,
		});

		const gallerySelect = yield* withGallerySelectFx({});

		return sourceSelect.select((eb) => [
			eb.ref("l.id").as("id"),
			eb.ref("l.id").as("listingId"),
			eb.ref("l.title").as("title"),
			jsonObjectFrom(gallerySelect.where("gal.id", "=", eb.ref("l.galleryId")).limit(1))
				.$notNull()
				.as("gallery"),
			sql<number>`(${eb
				.selectFrom("transaction as lt")
				.select((eb) => eb.fn.countAll<number>().as("count"))
				.whereRef("lt.listingId", "=", "l.id")})`.as("count"),
			sql<Date>`(${eb
				.selectFrom("transaction as lt")
				.select((eb) => eb.fn.max<Date>("lt.updatedAt").as("lastAt"))
				.whereRef("lt.listingId", "=", "l.id")})`.as("lastAt"),
		]);
	},
);
