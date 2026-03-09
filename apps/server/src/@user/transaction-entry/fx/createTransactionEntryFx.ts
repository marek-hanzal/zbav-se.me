import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { transactionTouchFx } from "~/@user/transaction/fx/transactionTouchFx";
import { transactionEntryFetchFx } from "~/@user/transaction-entry/fx/transactionEntryFetchFx";
import type { TransactionEntryTableSchema } from "~/database/@table/TransactionEntryTableSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";

export namespace createTransactionEntryFx {
	export type Props = Pick<
		TransactionEntryTableSchema.Type,
		"transactionId" | "kind" | "userId" | "payload"
	> & {
		scopeUserId: string;
	};
}

/**
 * Appends one already-prepared timeline row into `transaction_entry`.
 *
 * This is the low-level write helper for the new transaction-centric timeline.
 * We use it once the caller already knows:
 * - which `transactionId` the entry belongs to
 * - which discriminating `kind` it should use
 * - who the actor is (`userId` or `null` for automatic/system events)
 * - what validated payload should be stored
 *
 * The helper keeps the append behavior consistent in one place:
 * - inserts the row into `transaction_entry`
 * - bumps `transaction.updatedAt` / extends expiry through `transactionTouchFx`
 * - fetches the created entry back through the normal scoped read path
 *
 * In practice this is the shared primitive used by:
 * - user-authored transaction entries (`text`, `gallery`, `location`, `package`, `personal`)
 * - system/status timeline entries emitted from transaction status changes
 */
export const createTransactionEntryFx = Effect.fn("createTransactionEntryFx")(function* ({
	transactionId,
	kind,
	userId,
	payload,
	scopeUserId,
}: createTransactionEntryFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;
	const id = genId();

	yield* tryDbFx(async () =>
		kysely
			.insertInto("transaction_entry")
			.values({
				id,
				transactionId,
				kind,
				userId,
				payload,
				createdAt: dateContext.now().toJSDate(),
			})
			.executeTakeFirstOrThrow(),
	);

	yield* transactionTouchFx({
		transactionId,
		userId: scopeUserId,
	});

	return yield* transactionEntryFetchFx({
		userId: scopeUserId,
		where: {
			id,
		},
	});
});
