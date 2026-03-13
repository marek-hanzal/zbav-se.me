import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import type { TransactionSortSchema } from "~/@common/transaction/schema/TransactionSortSchema";
import { withTransactionSourceSelectFx } from "~/@seller/transaction/db/withTransactionSourceSelectFx";
import { withGallerySelectFx } from "~/@user/gallery/db/withGallerySelectFx";
import type { TransactionEntryDirectionEnumSchema } from "~/@user/transaction-entry/schema/TransactionEntryDirectionEnumSchema";
import type { TransactionEntrySchema } from "~/@user/transaction-entry/schema/TransactionEntrySchema";
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

	return transactionSourceSelect.selectAll("lt").select((eb) => {
		const lastActivitySelect = eb
			.selectFrom("transaction_entry as te")
			.whereRef("te.transactionId", "=", "lt.id")
			.orderBy("te.createdAt", "desc")
			.limit(1);

		return [
			"l.title",
			"l.price",
			"l.priceType",
			"l.currency",
			"lt.updatedAt as lastAt",
			jsonObjectFrom(
				lastActivitySelect.selectAll("te").select((eb) =>
					sql<TransactionEntryDirectionEnumSchema.Type>`case
							when ${eb.ref("te.userId")} is null then 'system'
							when ${eb.ref("te.userId")} = ${eb.ref("l.userId")} then 'out'
							else 'in'
						end`.as("direction"),
				),
			)
				.$notNull()
				.$castTo<TransactionEntrySchema.Type>()
				.as("entry"),
			sql<number>`coalesce((${eb
				.selectFrom("inbox as i")
				.select((eb) => eb.fn.countAll<number>().as("unreadCount"))
				.whereRef("i.userId", "=", "l.userId")
				.where("i.family", "=", "transaction")
				.where("i.type", "=", "buyer-message")
				.where("i.archivedAt", "is", null)
				.where(
					(eb) =>
						sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("lt.id")}]::text[]`,
				)}), 0)`.as("unreadCount"),
			sql<LocationTableSchema.Type>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
			jsonObjectFrom(gallerySelect.where("gal.id", "=", eb.ref("l.galleryId")).limit(1))
				.$notNull()
				.as("gallery"),
			eb.ref("lt.status").$notNull().as("status"),
		];
	});
});
