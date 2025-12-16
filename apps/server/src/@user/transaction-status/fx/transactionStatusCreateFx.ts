import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import type { TransactionStatusCreateSchema } from "~/app/transaction-status/schema/TransactionStatusCreateSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { transactionStatusFetchFx } from "./transactionStatusFetchFx";

export namespace transactionStatusCreateFx {
	export type Props = TransactionStatusCreateSchema.Type;
}

export const transactionStatusCreateFx = (create: transactionStatusCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const id = genId();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("transaction_status")
				.values({
					id,
					...create,
					createdAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		yield* transactionPatchFx({
			patch: {},
			query: {
				where: {
					id: create.transactionId,
				},
			},
		});

		return yield* transactionStatusFetchFx({
			where: {
				id,
			},
		});
	});
};

export type transactionStatusCreateFx = ReturnType<typeof transactionStatusCreateFx>;
