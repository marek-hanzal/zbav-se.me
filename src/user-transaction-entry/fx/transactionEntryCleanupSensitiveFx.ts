import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { TransactionEntrySensitiveKindEnumSchema } from "~/transaction-contract/schema/TransactionEntrySensitiveKindEnumSchema";
import type { TransactionStatusEnumSchema } from "~/transaction-contract/schema/TransactionStatusEnumSchema";
import { Transitions } from "~/user-transaction/fx/transactionTransitionFx";

export namespace transactionEntryCleanupSensitiveFx {
	export interface Props {
		transactionId: string;
		status: TransactionStatusEnumSchema.Type;
	}
}

export const transactionEntryCleanupSensitiveFx = Effect.fn("transactionEntryCleanupSensitiveFx")(
	function* ({ transactionId, status }: transactionEntryCleanupSensitiveFx.Props) {
		const logger = yield* getLoggerFx(
			"transactionEntryCleanupSensitiveFx",
			"transaction-entry",
		);
		logger.trace("transactionEntryCleanupSensitiveFx", {
			transactionId,
			status,
		});

		if (!Transitions.CleanupSensitiveStatus.includes(status)) {
			return;
		}

		return yield* dbFx(async (kysely) => {
			return kysely
				.deleteFrom("transaction_entry")
				.where("transactionId", "=", transactionId)
				.where("kind", "in", TransactionEntrySensitiveKindEnumSchema.options)
				.executeTakeFirst();
		});
	},
);
