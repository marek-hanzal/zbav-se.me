import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withTransactionListingSourceSelectFx } from "~/@seller/transaction-listing/db/withTransactionListingSourceSelectFx";
import type { TransactionListingSortSchema } from "~/@seller/transaction-listing/schema/TransactionListingSortSchema";
import { withGallerySelectFx } from "~/@user/gallery/db/withGallerySelectFx";

export namespace withTransactionListingSelectFx {
	export interface Props {
		sort?: TransactionListingSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withTransactionListingSelectFx>>;
}

export const withTransactionListingSelectFx = Effect.fn("withTransactionListingSelectFx")(
	function* ({ sort }: withTransactionListingSelectFx.Props) {
		const sourceSelect = yield* withTransactionListingSourceSelectFx({});

		const gallerySelect = yield* withGallerySelectFx({});

		let query = sourceSelect.select((eb) => {
			return [
				eb.ref("l.id").as("listingId"),
				jsonObjectFrom(gallerySelect.where("gal.id", "=", eb.ref("l.galleryId")).limit(1))
					.$notNull()
					.as("gallery"),
				sql<number>`(${eb
					.selectFrom("transaction as lt")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.whereRef("lt.listingId", "=", "l.id")})`.as("count"),
				sql<number>`coalesce((${eb
					.selectFrom("inbox as i")
					.select((eb) =>
						sql<number>`count(distinct ${eb.ref("i.payload")} ->> 'transactionId')`.as(
							"unreadCount",
						),
					)
					.whereRef("i.userId", "=", "l.userId")
					.where("i.family", "=", "transaction")
					.where("i.type", "=", "buyer-message")
					.where("i.archivedAt", "is", null)
					.where(
						(eb) =>
							sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("l.id")}]::text[]`,
					)}), 0)`.as("unreadCount"),
			];
		});

		for (const item of sort ?? []) {
			query = match(item.field)
				.with("createdAt", () => query.orderBy("l.createdAt", item.order))
				.with("lastAt", () => query.orderBy("lastAt", item.order))
				.exhaustive();
		}

		return query;
	},
);
