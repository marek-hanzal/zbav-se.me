import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import type { TransactionSortSchema } from "~/@common/transaction/schema/TransactionSortSchema";
import { withTransactionSourceSelectFx } from "~/@seller/transaction/db/withTransactionSourceSelectFx";
import type { TransactionSchema } from "~/@seller/transaction/schema/TransactionSchema";
import { withGallerySelectFx } from "~/@user/gallery/db/withGallerySelectFx";
import type { LocationTableSchema } from "~/database/@table/LocationTableSchema";

export namespace withTransactionSelectFx {
	export interface Props {
		sort?: TransactionSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withTransactionSelectFx>>;
}

export const withTransactionSelectFx = Effect.fn("withTransactionSelectFx")(function* ({
	sort,
}: withTransactionSelectFx.Props) {
	const transactionSourceSelect = yield* withTransactionSourceSelectFx({
		sort,
	});

	const gallerySelect = yield* withGallerySelectFx({});
	type tLastKind = TransactionSchema.Type["lastKind"];

	return transactionSourceSelect.selectAll("lt").select((eb) => {
		const lastActivitySelect = eb
			.selectFrom("transaction_entry as te")
			.whereRef("te.transactionId", "=", "lt.id")
			.orderBy("te.createdAt", "desc")
			.limit(1);

		const lastTextSelect = lastActivitySelect.select((leb) =>
			sql<
				string | null
			>`case when ${leb.ref("te.kind")} = 'text' then ${leb.ref("te.payload")}->>'text' else null end`.as(
				"lastText",
			),
		);

		return [
			"l.title",
			"l.price",
			"l.priceType",
			"l.currency",
			"lt.updatedAt as lastAt",
			sql<tLastKind | null>`(${lastActivitySelect.select("te.kind")})`.as("lastKind"),
			sql<string | null>`(${lastTextSelect})`.as("lastText"),
			sql<number>`coalesce((${eb
				.selectFrom("inbox as i")
				.select((eb) => eb.fn.countAll<number>().as("unreadCount"))
				.whereRef("i.userId", "=", "l.userId")
				.where("i.family", "=", "transaction")
				.where("i.type", "=", "buyer-message")
				.where("i.archivedAt", "is", null)
				.where(
					(ieb) =>
						sql<boolean>`${ieb.ref("i.reference")} @> ARRAY[${eb.ref("lt.id")}]::text[]`,
				)}), 0)`.as("unreadCount"),
			sql<LocationTableSchema.Type>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
			jsonObjectFrom(gallerySelect.where("gal.id", "=", eb.ref("l.galleryId")).limit(1))
				.$notNull()
				.as("gallery"),
			eb.ref("lt.status").$notNull().as("status"),
		];
	});
});
