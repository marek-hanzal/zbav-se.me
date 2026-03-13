import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withTransactionListingSourceSelectFx } from "~/@seller/transaction-listing/db/withTransactionListingSourceSelectFx";
import { withUnreadBuyerMessageInboxQuery } from "~/@seller/transaction-listing/db/withUnreadBuyerMessageInboxQuery";
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
			const unreadSelect = withUnreadBuyerMessageInboxQuery(eb.selectFrom("inbox as i"));

			return [
				eb.ref("l.id").as("listingId"),
				jsonObjectFrom(gallerySelect.where("gal.id", "=", eb.ref("l.galleryId")).limit(1))
					.$notNull()
					.as("gallery"),
				sql<number>`(${eb
					.selectFrom("transaction as lt")
					.select((eb) => eb.fn.countAll<number>().as("count"))
					.whereRef("lt.listingId", "=", "l.id")})`.as("count"),
				sql<number>`coalesce((${unreadSelect.select((eb) =>
					sql<number>`count(distinct ${eb.ref("i.payload")} ->> 'transactionId')`.as(
						"unreadCount",
					),
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
