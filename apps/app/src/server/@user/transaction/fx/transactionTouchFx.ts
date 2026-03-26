import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { TransactionContextFx } from "~/server/@user/transaction/context/TransactionContextFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

export namespace transactionTouchFx {
	export interface Props {
		transactionId: string;
		userId: string;
	}
}

export const transactionTouchFx = Effect.fn("transactionTouchFx")(function* ({
	transactionId,
}: transactionTouchFx.Props) {
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
