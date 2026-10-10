import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import type { TransactionSideEnumSchema } from "~/transaction-contract/schema/TransactionSideEnumSchema";
import type { TransactionStatusEnumSchema } from "~/transaction-contract/schema/TransactionStatusEnumSchema";
import { transactionTransitionFx } from "~/user-transaction/fx/transactionTransitionFx";
import { transactionEntryCleanupSensitiveFx } from "~/user-transaction-entry/fx/transactionEntryCleanupSensitiveFx";

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
	const logger = yield* getLoggerFx("transactionUpdateStatusFx");
	logger.trace("transactionUpdateStatusFx", {
		transactionId,
		status,
		request,
		target,
	});

	yield* transactionTransitionFx({
		status,
		request,
		side: target,
	});

	const dateService = yield* DateServiceFx;
	const now = dateService.nowFn().toJSDate();

	yield* dbFx(async (kysely) => {
		return kysely
			.updateTable("transaction")
			.set({
				status: request,
				statusUpdatedAt: now,
				updatedAt: now,
			})
			.where("id", "=", transactionId)
			.executeTakeFirstOrThrow();
	});

	yield* transactionEntryCleanupSensitiveFx({
		transactionId,
		status: request,
	});
});

export type transactionUpdateStatusFx = ReturnType<typeof transactionUpdateStatusFx>;
