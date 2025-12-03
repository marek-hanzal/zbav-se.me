import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { ListingCartCreateSchema } from "~/@user/listing-cart/schema/ListingCartCreateSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";
import { NotFoundError } from "~/error/NotFoundError";

export namespace listingCartCreateFx {
	export type Props = ListingCartCreateSchema.Type;
}

export const listingCartCreateFx = (props: listingCartCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const id = genId();

		const feed = yield* Effect.tryPromise(async () => {
			return database
				.selectFrom("feed")
				.selectAll()
				.where("id", "=", props.feedId)
				.executeTakeFirst();
		});

		if (!feed) {
			return new NotFoundError({
				resource: "feed",
				resourceId: props.feedId,
				message: "Feed not found",
			});
		}

		if (feed.userId !== user.id) {
			return new InvalidRequestError({
				message: "Unknown feed",
			});
		}

		return yield* Effect.tryPromise({
			async try() {
				return database
					.insertInto("listing_cart")
					.values({
						id,
						userId: user.id,
						...props,
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
