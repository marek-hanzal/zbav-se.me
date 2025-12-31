import { Effect } from "effect";
import { userEventBuyerInfoFx } from "~/@user/user-event/fx/userEventBuyerInfoFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace transactionGetBuyerInfoFx {
	export interface Props {
		transactionId: string;
	}
}

export const transactionGetBuyerInfoFx = ({ transactionId }: transactionGetBuyerInfoFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const userInfo = yield* Effect.promise(async () => {
			return database
				.selectFrom("user")
				.selectAll()
				.where(
					"id",
					"=",
					database
						.selectFrom("transaction as lt")
						.innerJoin("listing as l", "l.id", "lt.listingId")
						.select("lt.userId")
						.where("lt.id", "=", transactionId)
						/**
						 * Technically even buyer can see his own data, but for sake of security hardness,
						 * we keep only seller's point of view.
						 */
						.where("l.userId", "=", user.id),
				)
				.executeTakeFirst();
		});

		if (!userInfo) {
			return yield* new NotFoundError({
				resource: "transaction-buyer-info",
				message: "Buyer info not available",
			});
		}

		const buyerReaction = yield* userEventBuyerInfoFx({
			userId: userInfo.id,
		});

		return yield* Effect.succeed({
			registered: userInfo.createdAt,
			score: 0,
		});
	});
};

export type transactionGetBuyerInfoFx = ReturnType<typeof transactionGetBuyerInfoFx>;
