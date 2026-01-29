import { NotFoundErrorFx } from "@use-pico/common/error";
import { zodFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { userEventBuyerInfoFx } from "~/@buyer-session/user-event/fx/userEventBuyerInfoFx";
import { TransactionBuyerInfoSchema } from "~/@buyer-user/transaction/schema/TransactionBuyerInfoSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace transactionGetBuyerInfoFx {
	export interface Props {
		userId: string;
		transactionId: string;
	}
}

export const transactionGetBuyerInfoFx = Effect.fn("transactionGetBuyerInfoFx")(function* ({
	userId,
	transactionId,
}: transactionGetBuyerInfoFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	const userInfo = yield* Effect.promise(async () => {
		return kysely
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
				return eb.onRef("l.id", "=", "lt.listingId").on("l.userId", "=", userId);
			})
			.select([
				"u.id",
				"u.createdAt",
			])
			.executeTakeFirst();
	});

	if (!userInfo) {
		return yield* new NotFoundErrorFx({
			resource: "transaction-buyer-info",
			message: "Buyer info not available",
		});
	}

	return yield* zodFx({
		schema: TransactionBuyerInfoSchema,
		dataFx: Effect.succeed({
			registered: userInfo.createdAt,
			events: yield* userEventBuyerInfoFx({
				userId: userInfo.id,
			}),
		} satisfies TransactionBuyerInfoSchema.Type),
	});
});

export type transactionGetBuyerInfoFx = ReturnType<typeof transactionGetBuyerInfoFx>;
