import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { transactionEntryCleanupSensitiveFx } from "~/@user/transaction-entry/fx/transactionEntryCleanupSensitiveFx";
import { withTransactionStatusEntryFx } from "~/@user/transaction-entry/fx/withTransactionStatusEntryFx";
import { Transitions, transactionTransitionFx } from "~/@user/transaction/fx/transactionTransitionFx";
import type { TransactionSideEnumSchema } from "~/database/@enum/TransactionSideEnumSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { traceLogFx } from "~/effect/traceLogFx";

export namespace transactionUpdateStatusFx {
	export interface Props {
		/**
		 * Target transaction identifier whose status is being updated.
		 */
		transactionId: string;
		/**
		 * Acting user performing the transition.
		 */
		userId: string;
		/**
		 * Current transaction status we are processing.
		 */
		status: Transitions.Status;
		/**
		 * Requested target status we want to transition to.
		 */
		request: Transitions.StatusRequest;
		/**
		 * Side this transition is meant for.
		 *
		 * Use `null` for side-agnostic system transitions.
		 */
		target: Transitions.Side;
		/**
		 * Acting side stored into the transaction entry timeline.
		 */
		side: TransactionSideEnumSchema.Type;
	}
}

export const transactionUpdateStatusFx = Effect.fn("transactionUpdateStatusFx")(function* ({
	transactionId,
	userId,
	status,
	request,
	target,
	side,
}: transactionUpdateStatusFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "transactionUpdateStatusFx",
		input: {
			transactionId,
			userId,
			status,
			request,
			target,
			side,
		},
	});

	yield* transactionTransitionFx({
		status,
		request,
		side: target,
	});

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	yield* tryDbFx(async () =>
			kysely
				.updateTable("transaction")
				.set({
					status: request,
					statusUpdatedAt: dateContext.now().toJSDate(),
				})
				.where("id", "=", transactionId)
				.executeTakeFirstOrThrow(),
	);

	yield* withTransactionStatusEntryFx({
		transactionId,
		userId,
		scopeUserId: userId,
		status: request,
		side,
	});

	yield* transactionEntryCleanupSensitiveFx({
		transactionId,
		status: request,
	});
});

export type transactionUpdateStatusFx = ReturnType<typeof transactionUpdateStatusFx>;
