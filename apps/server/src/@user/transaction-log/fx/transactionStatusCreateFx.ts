import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import { transactionStatusFetchFx } from "~/@user/transaction-status/fx/transactionStatusFetchFx";
import type { TransactionSideEnumSchema } from "~/app/transaction/schema/TransactionSideEnumSchema";
import type { TransactionStatusEnumSchema } from "~/app/transaction/schema/TransactionStatusEnumSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace transactionStatusCreateFx {
	export interface Props {
		messageThreadId: string;
		status: TransactionStatusEnumSchema.Type;
		side: TransactionSideEnumSchema.Type;
	}
}

export const transactionStatusCreateFx = ({
	messageThreadId,
	status,
	side,
}: transactionStatusCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const id = genId();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("transaction_status")
				.values({
					id,
					messageThreadId,
					status,
					side,
					createdAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		yield* transactionPatchFx({
			messageThreadId,
		});

		return yield* transactionStatusFetchFx({
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type transactionStatusCreateFx = ReturnType<typeof transactionStatusCreateFx>;
