import { NotFoundErrorFx } from "@use-pico/common/error";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace listingCheckIfOwnFx {
	export interface Props {
		userId: string;
		listingId: string;
		message: string;
	}
}

/**
 * Validates that a listing exists and that the current user does not own it.
 * Returns the listing's userId if validation passes.
 */
export const listingCheckIfOwnFx = Effect.fn("listingCheckIfOwnFx")(function* ({
	userId,
	listingId,
	message,
}: listingCheckIfOwnFx.Props) {
	const database = yield* DatabaseContextFx;
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

	if (listing.userId === userId) {
		return yield* new InvalidRequestError({
			message,
		});
	}

	return listing.userId;
});

export type listingCheckIfOwnFx = ReturnType<typeof listingCheckIfOwnFx>;

