import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { NotFoundErrorFx } from "~/error/error/NotFoundErrorFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { InvalidRequestErrorFx } from "~/server-error/error/InvalidRequestErrorFx";

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
	const logger = yield* getLoggerFx("listingCheckIfOwnFx");
	logger.trace("listingCheckIfOwnFx", {
		userId,
		listingId,
		message,
	});

	const listing = yield* dbFx(async (kysely) => {
		return kysely
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
		return yield* new InvalidRequestErrorFx({
			message,
		});
	}

	return listing.userId;
});

export type listingCheckIfOwnFx = ReturnType<typeof listingCheckIfOwnFx>;
