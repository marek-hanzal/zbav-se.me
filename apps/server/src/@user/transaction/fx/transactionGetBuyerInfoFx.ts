import { Effect } from "effect";
import type { TransactionBuyerInfoSchema } from "~/@user/transaction/schema/TransactionBuyerInfoSchema";
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
				.selectFrom("user as u")
				.innerJoin("transaction as lt", (eb) => {
					/**
					 * We're picking up the buyer (user who created the transaction).
					 */
					return eb.onRef("lt.userId", "=", "u.id").on("lt.id", "=", transactionId);
				})
				.innerJoin("listing as l", (eb) => {
					/**
					 * Ensure current user is owner of the listing
					 */
					return eb.onRef("l.id", "=", "lt.listingId").on("l.userId", "=", user.id);
				})
				.select([
					"u.id",
					"u.createdAt",
				])
				.executeTakeFirst();
		});

		if (!userInfo) {
			return yield* new NotFoundError({
				resource: "transaction-buyer-info",
				message: "Buyer info not available",
			});
		}

		return yield* Effect.succeed({
			registered: userInfo.createdAt,
			events: yield* userEventBuyerInfoFx({
				userId: userInfo.id,
			}),
		} satisfies TransactionBuyerInfoSchema.Type);
	});
};

export type transactionGetBuyerInfoFx = ReturnType<typeof transactionGetBuyerInfoFx>;
