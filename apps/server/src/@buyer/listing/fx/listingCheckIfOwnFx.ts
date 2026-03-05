import { NotFoundErrorFx } from "@use-pico/common/error";
import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { traceLogFx } from "~/effect/traceLogFx";
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
	yield* traceLogFx({
		level: "trace",
		message: "listingCheckIfOwnFx",
		input: {
			userId,
			listingId,
			message,
		},
	});

	const { kysely } = yield* KyselyContextFx;
	const listing = yield* tryDbFx(async () =>
		kysely
			.selectFrom("listing")
			.select("userId")
			.where("id", "=", listingId)
			.executeTakeFirst(),
	);

	if (!listing) {
		yield* traceLogFx({
			level: "trace",
			message: "listingCheckIfOwnFx",
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
		yield* traceLogFx({
			level: "trace",
			message: "listingCheckIfOwnFx",
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
