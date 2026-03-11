import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withTransactionListingSourceSelectFx } from "~/@seller/transaction-listing/db/withTransactionListingSourceSelectFx";
import type { TransactionListingSchema } from "~/@seller/transaction-listing/schema/TransactionListingSchema";
import { withGallerySelectFx } from "~/@user/gallery/db/withGallerySelectFx";

export namespace withTransactionListingSelectFx {
	export interface Props extends withTransactionListingSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withTransactionListingSelectFx>>;
}

type tLastKind = TransactionListingSchema.Type["lastKind"];

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
			sql<number>`coalesce((${eb
				.selectFrom("inbox as i")
				.select((eb) => eb.fn.countAll<number>().as("unreadCount"))
				.whereRef("i.userId", "=", "l.userId")
				.where("i.family", "=", "transaction")
				.where("i.type", "=", "buyer-message")
				.where("i.archivedAt", "is", null)
				.where(
					sql<boolean>`${sql.ref("i.reference")} @> ARRAY[${eb.ref("l.id")}]::text[]`,
				)}), 0)`.as("unreadCount"),
			sql<Date>`(${eb
				.selectFrom("transaction_entry as te")
				.innerJoin("transaction as lt", "lt.id", "te.transactionId")
				.select("te.createdAt")
				.whereRef("lt.listingId", "=", "l.id")
				.orderBy("te.createdAt", "desc")
				.limit(1)})`.as("lastAt"),
			sql<tLastKind>`(${eb
				.selectFrom("transaction_entry as te")
				.innerJoin("transaction as lt", "lt.id", "te.transactionId")
				.select("te.kind")
				.whereRef("lt.listingId", "=", "l.id")
				.orderBy("te.createdAt", "desc")
				.limit(1)})`.as("lastKind"),
			sql<string | null>`(
				select case when te.kind = 'text' then te.payload->>'text' else null end
				from "transaction_entry" as te
				inner join "transaction" as lt on lt.id = te."transactionId"
				where lt."listingId" = l.id
				order by te."createdAt" desc
				limit 1
			)`.as("lastText"),
		]);
	},
);
