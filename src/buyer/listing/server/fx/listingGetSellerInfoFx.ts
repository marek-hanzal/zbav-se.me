import { Effect } from "effect";
import { sql } from "kysely";
import type { SellerInfoSchema } from "~/buyer/listing/server/schema/SellerInfoSchema";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { NotFoundErrorFx } from "~/error/error/NotFoundErrorFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace listingGetSellerInfoFx {
	export interface Props {
		listingId: string;
	}
}

export const listingGetSellerInfoFx = Effect.fn("listingGetSellerInfoFx")(function* ({
	listingId,
}: listingGetSellerInfoFx.Props) {
	const logger = yield* getLoggerFx("listingGetSellerInfoFx");
	logger.trace("listingGetSellerInfoFx", {
		listingId,
	});

	const userInfo = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("listing as l")
			.innerJoin("user as u", "u.id", "l.userId")
			.select((eb) => [
				"u.id",
				"u.createdAt",
				eb
					.selectFrom("listing as l2")
					.select(sql<number>`count(*)::int`.as("listings"))
					.whereRef("l2.userId", "=", "u.id")
					.$asScalar()
					.$notNull()
					.as("listings"),
			])
			.where("l.id", "=", listingId)
			.executeTakeFirst();
	});

	if (!userInfo) {
		return yield* new NotFoundErrorFx({
			resource: "listing-seller-info",
			message: "Seller info not available",
		});
	}

	const events = yield* userEventSellerInfoFx({
		userId: userInfo.id,
	});

	return {
		registered: userInfo.createdAt,
		listings: userInfo.listings,
		events,
	} satisfies SellerInfoSchema.Type;
});

export type listingGetSellerInfoFx = ReturnType<typeof listingGetSellerInfoFx>;
