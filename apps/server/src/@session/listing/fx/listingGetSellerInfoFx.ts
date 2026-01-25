import { NotFoundErrorFx } from "@use-pico/common/error";
import { zodFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { userEventSellerInfoFx } from "~/@user/user-event/fx/userEventSellerInfoFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { SellerInfoSchema } from "../schema/SellerInfoSchema";

export namespace listingGetSellerInfoFx {
	export interface Props {
		listingId: string;
	}
}

export const listingGetSellerInfoFx = Effect.fn("listingGetSellerInfoFx")(function* ({
	listingId,
}: listingGetSellerInfoFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	const userInfo = yield* Effect.promise(async () => {
		return kysely
			.selectFrom("listing as l")
			.innerJoin("user as u", "u.id", "l.userId")
			.select((eb) => [
				"u.id",
				"u.createdAt",
				eb
					.selectFrom("listing as l2")
					.select((eb) => eb.fn.countAll<number>().as("listings"))
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

	return yield* zodFx({
		schema: SellerInfoSchema,
		dataFx: Effect.succeed({
			registered: userInfo.createdAt,
			listings: Number(userInfo.listings),
			events,
		} satisfies SellerInfoSchema.Type),
	});
});

export type listingGetSellerInfoFx = ReturnType<typeof listingGetSellerInfoFx>;
