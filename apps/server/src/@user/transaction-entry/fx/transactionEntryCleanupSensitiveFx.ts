import { Effect } from "effect";
import { Transitions } from "~/@user/transaction/fx/transactionTransitionFx";
import type { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";

export namespace transactionEntryCleanupSensitiveFx {
	export interface Props {
		transactionId: string;
		status: TransactionStatusEnumSchema.Type;
	}
}

export const transactionEntryCleanupSensitiveFx = Effect.fn("transactionEntryCleanupSensitiveFx")(
	function* ({ transactionId, status }: transactionEntryCleanupSensitiveFx.Props) {
		if (!Transitions.CleanupSensitiveStatus.includes(status)) {
			return;
		}

		const { kysely } = yield* KyselyContextFx;

		return yield* tryDbFx(async () =>
			kysely
				.deleteFrom("transaction_entry")
				.where("transactionId", "=", transactionId)
				.where("kind", "in", [
					"location",
					"package",
					"personal",
				])
				.executeTakeFirst(),
		);
	},
);
