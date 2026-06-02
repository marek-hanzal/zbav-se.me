import { Effect } from "effect";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace listingCheckIfOwnFx {
	export interface Props {
		userId: string;
		listingId: string;
	}
}

/**
 * Validates that a listing exists and that the current user does own it.
 * Returns the listing's userId if validation passes.
 */
export const listingCheckIfOwnFx = Effect.fn("listingCheckIfOwnFx")(function* ({
	userId,
	listingId,
}: listingCheckIfOwnFx.Props) {
	const logger = yield* getLoggerFx("listingCheckIfOwnFx");
	logger.trace("listingCheckIfOwnFx", {
		userId,
		listingId,
	});

	const listing = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("listing")
			.select("userId")
			.where("id", "=", listingId)
			.where("userId", "=", userId)
			.executeTakeFirst();
	});

	if (!listing) {
		return yield* new NotFoundErrorFx({
			resource: "listing",
			resourceId: listingId,
			message: "Listing not found",
		});
	}

	return listing.userId;
});

export type listingCheckIfOwnFx = ReturnType<typeof listingCheckIfOwnFx>;
