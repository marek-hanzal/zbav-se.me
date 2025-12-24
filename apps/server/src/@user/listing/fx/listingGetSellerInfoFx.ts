import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace listingGetSellerInfoFx {
	export interface Props {
		listingId: string;
	}
}

export namespace listingGetSellerInfoFx {
	export interface Props {
		listingId: string;
	}
}

export const listingGetSellerInfoFx = ({ listingId }: listingGetSellerInfoFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const info = yield* Effect.tryPromise(async () => {
			return database
				.selectFrom("listing as l")
				.innerJoin("user as u", "u.id", "l.userId")
				.select((eb) => [
					"u.id as sellerId",
					"u.createdAt as registered",
					eb
						.selectFrom("listing as l2")
						.select((eb2) => eb2.fn.countAll<number>().as("listings"))
						.whereRef("l2.userId", "=", "u.id")
						.$asScalar()
						.$notNull()
						.as("listings"),
				])
				.where("l.id", "=", listingId)
				.executeTakeFirst();
		});

		if (!info) {
			return yield* new NotFoundError({
				resource: "listing-seller-info",
				message: "Seller info not available",
			});
		}

		return {
			registered: info.registered,
			listings: Number(info.listings),
			score: 3,
		};
	});
};

export type listingGetSellerInfoFx = ReturnType<typeof listingGetSellerInfoFx>;
