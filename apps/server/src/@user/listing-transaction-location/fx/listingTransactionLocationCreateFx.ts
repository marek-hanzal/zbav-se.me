import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { ListingTransactionSideEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionSideEnumSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { listingTransactionLocationFetchFx } from "./listingTransactionLocationFetchFx";

export namespace listingTransactionLocationCreateFx {
	export interface Props {
		listingTransactionId: string;
		locationId: string;
		time: Date;
		side: ListingTransactionSideEnumSchema.Type;
	}
}

export const listingTransactionLocationCreateFx = ({
	listingTransactionId,
	locationId,
	time,
	side,
}: listingTransactionLocationCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const id = genId();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("listing_transaction_location")
				.values({
					id,
					listingTransactionId,
					locationId,
					time,
					side,
					createdAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		return yield* listingTransactionLocationFetchFx({
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type listingTransactionLocationCreateFx = ReturnType<
	typeof listingTransactionLocationCreateFx
>;
