import { Effect } from "effect";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import type { LocationDbSchema } from "~/@session/location/schema/LocationDbSchema";
import { withGallerySelectFx } from "~/@user/gallery/db/withGallerySelectFx";
import { withTransactionSourceSelectFx } from "~/app/transaction/db/withTransactionSourceSelectFx";
import type { TransactionSortSchema } from "~/app/transaction/schema/TransactionSortSchema";

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

	return transactionSourceSelect.selectAll("lt").select([
		"l.title",
		"l.price",
		"l.priceType",
		"l.currency",
		"lt.updatedAt as lastAt",
		(eb) => sql<LocationDbSchema.Type>`to_jsonb(${eb.table("loc")}.*)`.as("location"),
		(eb) =>
			jsonObjectFrom(gallerySelect.where("gal.id", "=", eb.ref("l.galleryId")).limit(1))
				.$notNull()
				.as("gallery"),
		(eb) => eb.ref("status.latestStatus").$notNull().as("status"),
	]);
});
