import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { ListingTransactionSideSchema } from "~/app/listing-transaction/schema/ListingTransactionSideSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { listingTransactionLocationFetchFx } from "./listingTransactionLocationFetchFx";

export namespace listingTransactionLocationCreateFx {
	export interface Props {
		listingTransactionId: string;
		locationId: string;
		time: Date;
		side: ListingTransactionSideSchema.Type;
		createdAt?: Date;
	}
}

export const listingTransactionLocationCreateFx = ({
	listingTransactionId,
	locationId,
	time,
	side,
	createdAt = new Date(),
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
					event: "location",
					locationId,
					time,
					side,
					createdAt,
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
