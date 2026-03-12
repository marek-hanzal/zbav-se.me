import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withTransactionListingSourceSelectFx } from "~/@seller/transaction-listing/db/withTransactionListingSourceSelectFx";
import type { TransactionListingSchema } from "~/@seller/transaction-listing/schema/TransactionListingSchema";
import type { TransactionListingSortSchema } from "~/@seller/transaction-listing/schema/TransactionListingSortSchema";
import { withGallerySelectFx } from "~/@user/gallery/db/withGallerySelectFx";

export namespace withTransactionListingSelectFx {
	export interface Props {
		sort?: TransactionListingSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withTransactionListingSelectFx>>;
}

type tLastKind = TransactionListingSchema.Type["lastKind"];

export const withTransactionListingSelectFx = Effect.fn("withTransactionListingSelectFx")(
	function* ({ sort }: withTransactionListingSelectFx.Props) {
		const sourceSelect = yield* withTransactionListingSourceSelectFx({});

		const gallerySelect = yield* withGallerySelectFx({});

		let query = sourceSelect.select((eb) => {
			const lastActivitySelect = eb
				.selectFrom("transaction_entry as te")
				.innerJoin("transaction as lt", "lt.id", "te.transactionId")
				.whereRef("lt.listingId", "=", "l.id")
				.orderBy("te.createdAt", "desc")
				.limit(1);

			const lastTextSelect = eb
				.selectFrom("transaction_entry as te")
				.innerJoin("transaction as lt", "lt.id", "te.transactionId")
				.select(sql<string | null>`te.payload->>'text'`.as("lastText"))
				.whereRef("lt.listingId", "=", "l.id")
				.where("te.kind", "=", "text")
				.orderBy("te.createdAt", "desc")
				.limit(1);

			return [
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
				sql<number>`coalesce((${eb
					.selectFrom("inbox as i")
					.select((eb) => eb.fn.countAll<number>().as("unreadCount"))
					.whereRef("i.userId", "=", "l.userId")
					.where("i.family", "=", "transaction")
					.where("i.type", "=", "buyer-message")
					.where("i.archivedAt", "is", null)
					.where(
						(ieb) =>
							sql<boolean>`${ieb.ref("i.reference")} @> ARRAY[${eb.ref("l.id")}]::text[]`,
					)}), 0)`.as("unreadCount"),
				sql<Date>`(${lastActivitySelect.select("te.createdAt")})`.as("lastAt"),
				sql<tLastKind>`(${lastActivitySelect.select("te.kind")})`.as("lastKind"),
				sql<string | null>`(${lastTextSelect})`.as("lastText"),
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
