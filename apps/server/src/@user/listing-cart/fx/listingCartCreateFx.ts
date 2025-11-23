import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { UserContextFx } from "../../../auth/fx/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { InvalidRequestError } from "../../../error/InvalidRequestError";

export namespace listingCartCreateFx {
	export interface Props {
		listingId: string;
	}
}

export const listingCartCreateFx = ({ listingId }: listingCartCreateFx.Props) => {
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
						createdAt: new Date(),
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
