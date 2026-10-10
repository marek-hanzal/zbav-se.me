import { Effect } from "effect";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { TransactionContextFx } from "~/user/transaction/server/context/TransactionContextFx";

export namespace transactionTouchFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const transactionTouchFx = Effect.fn("transactionTouchFx")(function* ({
	transactionId,
}: transactionTouchFx.Props) {
	const logger = yield* getLoggerFx("transactionTouchFx");
	logger.trace("transactionTouchFx", {
		transactionId,
	});

	const dateService = yield* DateServiceFx;
	const config = yield* TransactionContextFx;
	const now = dateService.now();

	yield* dbFx(async (kysely) => {
		return kysely
			.updateTable("transaction")
			.set({
				updatedAt: now.toJSDate(),
				expiresAt: now
					.plus({
						days: config.extend,
					})
					.toJSDate(),
			})
			.where("id", "=", transactionId)
			.executeTakeFirst();
	});
});
