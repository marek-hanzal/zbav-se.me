import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import type { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
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

		const { kysely } = yield* KyselyContextFx;

		return yield* tryDbFx(async () => {
			return kysely
				.deleteFrom("transaction_entry")
				.where("transactionId", "=", transactionId)
				.where("kind", "in", [
					"location",
					"package",
					"personal",
				])
				.executeTakeFirst();
		});
	},
);
