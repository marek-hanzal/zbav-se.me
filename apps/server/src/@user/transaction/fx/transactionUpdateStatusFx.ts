import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { transactionTransitionFx } from "~/@user/transaction/fx/transactionTransitionFx";
import { transactionEntryCleanupSensitiveFx } from "~/@user/transaction-entry/fx/transactionEntryCleanupSensitiveFx";
import type { TransactionSideEnumSchema } from "~/database/@enum/TransactionSideEnumSchema";
import type { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";

export namespace transactionUpdateStatusFx {
	export interface Props {
		/**
		 * Target transaction identifier whose status is being updated.
		 */
		transactionId: string;
		/**
		 * Current transaction status we are processing.
		 */
		status: TransactionStatusEnumSchema.Type | null;
		/**
		 * Requested target status we want to transition to.
		 */
		request: TransactionStatusEnumSchema.Type;
		/**
		 * Side this transition is meant for.
		 *
		 * Use `null` for side-agnostic system transitions.
		 */
		target: TransactionSideEnumSchema.Type | null;
	}
}

export const transactionUpdateStatusFx = Effect.fn("transactionUpdateStatusFx")(function* ({
	transactionId,
	status,
	request,
	target,
}: transactionUpdateStatusFx.Props) {
	yield* transactionTransitionFx({
		status,
		request,
		side: target,
	});

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;
	const now = dateContext.now().toJSDate();

	yield* tryDbFx(async () =>
		kysely
			.updateTable("transaction")
			.set({
				status: request,
				statusUpdatedAt: now,
				updatedAt: now,
			})
			.where("id", "=", transactionId)
			.executeTakeFirstOrThrow(),
	);

	yield* transactionEntryCleanupSensitiveFx({
		transactionId,
		status: request,
	});
});

export type transactionUpdateStatusFx = ReturnType<typeof transactionUpdateStatusFx>;
