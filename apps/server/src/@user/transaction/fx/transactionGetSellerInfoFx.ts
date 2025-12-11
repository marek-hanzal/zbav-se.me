import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace transactionGetSellerInfoFx {
	export interface Props {
		transactionId: string;
	}
}

export const transactionGetSellerInfoFx = ({
	transactionId,
}: transactionGetSellerInfoFx.Props) => {
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
						.select("l.userId")
						.where("lt.id", "=", transactionId)
						.where("lt.userId", "=", user.id),
				)
				.executeTakeFirst();
		});

		if (!userInfo) {
			return yield* new NotFoundError({
				resource: "transaction-seller-info",
				message: "Seller info not available",
			});
		}

		return yield* Effect.succeed({
			registered: userInfo.createdAt,
			score: 0,
		});
	});
};

export type transactionGetSellerInfoFx = ReturnType<
	typeof transactionGetSellerInfoFx
>;
