import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
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

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;
	const config = yield* TransactionContextFx;
	const now = dateContext.now();

	yield* tryDbFx(async () =>
		kysely
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
			.executeTakeFirst(),
	);
});
