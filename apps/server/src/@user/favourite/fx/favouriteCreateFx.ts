import { NotFoundErrorFx } from "@use-pico/common/error";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { FavouriteCreateSchema } from "~/@user/favourite/schema/FavouriteCreateSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace favouriteCreateFx {
	export type Props = FavouriteCreateSchema.Type;
}

export const favouriteCreateFx = Effect.fn("favouriteCreateFx")(function* (
	props: favouriteCreateFx.Props,
) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	const id = genId();

	const feed = yield* Effect.promise(async () => {
		return database
			.selectFrom("feed")
			.selectAll()
			.where("id", "=", props.feedId)
			.executeTakeFirst();
	});

	if (!feed) {
		return yield* new NotFoundErrorFx({
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
				.insertInto("favourite")
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
				message: "You already have this listing in your favourites",
			});
		},
	});
});

export type favouriteCreateFx = ReturnType<typeof favouriteCreateFx>;
