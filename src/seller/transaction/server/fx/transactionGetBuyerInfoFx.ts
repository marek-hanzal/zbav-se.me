import { Effect } from "effect";
import { NotFoundErrorFx } from "@/lib/common/error";
import { zodGuardFx } from "@/lib/common/fx";
import { getLoggerFx } from "@/lib/common/log";
import { TransactionBuyerInfoSchema } from "~/seller/transaction/server/schema/TransactionBuyerInfoSchema";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

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

	const { kysely } = yield* KyselyContextFx;

	const userInfo = yield* tryDbFx(async () =>
		kysely
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
			.executeTakeFirst(),
	);

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
