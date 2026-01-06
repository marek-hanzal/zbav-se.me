import { NotFoundErrorFx } from "@use-pico/common/error";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace listingCheckIfOwnFx {
	export interface Props {
		listingId: string;
		message: string;
	}
}

/**
 * Validates that a listing exists and that the current user does not own it.
 * Returns the listing's userId if validation passes.
 */
export const listingCheckIfOwnFx = Effect.fn("listingCheckIfOwnFx")(function* ({
	listingId,
	message,
}: listingCheckIfOwnFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	const listing = yield* Effect.promise(async () => {
		return database
			.selectFrom("listing")
			.select("userId")
			.where("id", "=", listingId)
			.executeTakeFirst();
	});

	if (!listing) {
		return yield* new NotFoundErrorFx({
			resource: "listing",
			resourceId: listingId,
			message: "Listing not found",
		});
	}

	if (listing.userId === user.id) {
		return yield* new InvalidRequestError({
			message,
		});
	}

	return listing.userId;
});

export type listingCheckIfOwnFx = ReturnType<typeof listingCheckIfOwnFx>;
