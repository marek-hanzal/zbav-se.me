import { NotFoundErrorFx } from "@use-pico/common/error";
import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTraceFx } from "~/effect/withTraceFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

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
	yield* withTraceFx({
		fx: "listingCheckIfOwnFx",
		input: {
			userId,
			listingId,
			message,
		},
	});

	const { kysely } = yield* KyselyContextFx;
	const listing = yield* Effect.promise(async () => {
		return kysely
			.selectFrom("listing")
			.select("userId")
			.where("id", "=", listingId)
			.executeTakeFirst();
	});

	if (!listing) {
		yield* withTraceFx({
			fx: "listingCheckIfOwnFx",
			error: {
				resource: "listing",
				resourceId: listingId,
				message: "Listing not found",
			},
		});
		return yield* new NotFoundErrorFx({
			resource: "listing",
			resourceId: listingId,
			message: "Listing not found",
		});
	}

	if (listing.userId === userId) {
		yield* withTraceFx({
			fx: "listingCheckIfOwnFx",
			error: {
				message,
			},
		});
		return yield* new InvalidRequestErrorFx({
			message,
		});
	}

	return listing.userId;
});

export type listingCheckIfOwnFx = ReturnType<typeof listingCheckIfOwnFx>;
