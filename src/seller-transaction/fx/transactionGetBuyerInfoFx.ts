import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { NotFoundErrorFx } from "~/error/error/NotFoundErrorFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { TransactionBuyerInfoSchema } from "~/seller-transaction/schema/TransactionBuyerInfoSchema";
import { userEventBuyerInfoFx } from "~/seller-user-event/fx/userEventBuyerInfoFx";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

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
	const logger = yield* getLoggerFx("transactionGetBuyerInfoFx");
	logger.trace("transactionGetBuyerInfoFx", {
		userId,
		transactionId,
	});

	const userInfo = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("user as u")
			.innerJoin("transaction as lt", (eb) => {
				return eb.onRef("lt.userId", "=", "u.id").on("lt.id", "=", transactionId);
			})
			.innerJoin("listing as l", (eb) => {
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

	return yield* zodGuardFx({
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
