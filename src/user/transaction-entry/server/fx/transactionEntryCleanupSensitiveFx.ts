import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { TransactionEntrySensitiveKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntrySensitiveKindEnumSchema";
import type { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { dbFx } from "~/server/database/fx/dbFx";
import { Transitions } from "~/user/transaction/server/fx/transactionTransitionFx";

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
