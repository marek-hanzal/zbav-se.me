import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { InvalidRequestError } from "../../../error/InvalidRequestError";

export namespace listingCartCreateFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		listingId: string;
		createdAt?: Date;
	}
}

export const listingCartCreateFx = ({
	database,
	userId,
	listingId,
	createdAt = new Date(),
}: listingCartCreateFx.Props) => {
	return Effect.gen(function* () {
		const id = genId();

		return yield* Effect.tryPromise({
			async try() {
				return database
					.insertInto("listing_cart")
					.values({
						id,
						userId,
						listingId,
						createdAt,
					})
					.returningAll()
					.executeTakeFirst();
			},
			catch() {
				return new InvalidRequestError({
					message: "You already have this listing in your cart",
				});
			},
		});
	});
};

export type listingCartCreateFx = ReturnType<typeof listingCartCreateFx>;
