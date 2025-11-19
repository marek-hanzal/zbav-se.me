import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { DatabaseContextFx } from "../../../service/DatabaseContextFx";
import { UserContextFx } from "../../../service/UserContextFx";

export namespace listingCartCreateFx {
	export interface Props {
		listingId: string;
		createdAt?: Date;
	}
}

export const listingCartCreateFx = ({
	listingId,
	createdAt = new Date(),
}: listingCartCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const id = genId();

		return yield* Effect.tryPromise({
			async try() {
				return database
					.insertInto("listing_cart")
					.values({
						id,
						userId: user.id,
						listingId,
						createdAt,
					})
					.returningAll()
					.executeTakeFirstOrThrow();
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
