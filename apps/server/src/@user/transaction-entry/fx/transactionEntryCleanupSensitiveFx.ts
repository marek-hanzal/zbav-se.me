import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";

export namespace transactionEntryCleanupSensitiveFx {
	export interface Props {
		transactionId: string;
	}
}

export const transactionEntryCleanupSensitiveFx = Effect.fn("transactionEntryCleanupSensitiveFx")(
	function* ({ transactionId }: transactionEntryCleanupSensitiveFx.Props) {
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
