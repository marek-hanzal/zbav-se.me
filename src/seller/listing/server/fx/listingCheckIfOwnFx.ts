import { Effect } from "effect";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import type { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

export namespace listingCheckIfOwnFx {
	export interface Props {
		userId: string;
		listingId: string;
		status: [
			ListingStatusEnumSchema.Type,
			...ListingStatusEnumSchema.Type[],
		];
	}
}

/**
 * Validates that a listing exists and that the current user does own it.
 * Returns the listing's userId if validation passes.
 */
export const listingCheckIfOwnFx = Effect.fn("listingCheckIfOwnFx")(function* ({
	userId,
	listingId,
	status,
}: listingCheckIfOwnFx.Props) {
	const logger = yield* getLoggerFx("listingCheckIfOwnFx");
	logger.trace("listingCheckIfOwnFx", {
		userId,
		listingId,
		status,
	});

	const { kysely } = yield* KyselyContextFx;

	const listing = yield* tryDbFx(async () => {
		return kysely
			.selectFrom("listing")
			.select("userId")
			.where("id", "=", listingId)
			.where("userId", "=", userId)
			.where("status", "in", status)
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
