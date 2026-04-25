import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { withTransactionSourceSelectFx } from "~/buyer/transaction/server/db/withTransactionSourceSelectFx";
import type { TransactionSortSchema } from "~/buyer/transaction/server/schema/TransactionSortSchema";
import type { LocationTableSchema } from "~/server/database/@table/LocationTableSchema";
import { withGallerySelectFx } from "~/user/gallery/server/db/withGallerySelectFx";
import { TransactionEntryDirectionEnumSchema } from "~/user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";
import type { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";

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
			eb.fn
				.coalesce(
					lastActivitySelect.select("te.createdAt").$asScalar(),
					eb.ref("lt.updatedAt"),
				)
				.as("lastAt"),
			jsonObjectFrom(
				lastActivitySelect
					.selectAll("te")
					.select(eb.ref("l.id").as("listingId"))
					.select((eb) =>
						sql<TransactionEntryDirectionEnumSchema.Type>`case
						when ${eb.ref("te.userId")} is null then ${TransactionEntryDirectionEnumSchema.enum.system}
						when ${eb.ref("te.userId")} = ${eb.ref("lt.userId")} then ${TransactionEntryDirectionEnumSchema.enum.out}
						else ${TransactionEntryDirectionEnumSchema.enum.in}
					end`.as("direction"),
					),
			)
				.$notNull()
				.$castTo<TransactionEntrySchema.Type>()
				.as("entry"),
			sql<number>`coalesce((${eb
				.selectFrom("activity as i")
				.select(sql<number>`count(*)::int`.as("unreadCount"))
				.whereRef("i.userId", "=", "lt.userId")
				.where("i.family", "=", "transaction")
				.where("i.type", "=", "seller-message")
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
