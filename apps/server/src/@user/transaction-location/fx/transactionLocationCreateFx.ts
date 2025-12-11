import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import type { TransactionSideEnumSchema } from "~/app/transaction/schema/TransactionSideEnumSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { transactionLocationFetchFx } from "./transactionLocationFetchFx";

export namespace transactionLocationCreateFx {
	export interface Props {
		messageThreadId: string;
		locationId: string;
		time: Date;
		side: TransactionSideEnumSchema.Type;
	}
}

export const transactionLocationCreateFx = ({
	messageThreadId,
	locationId,
	time,
	side,
}: transactionLocationCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const id = genId();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("transaction_location")
				.values({
					id,
					messageThreadId,
					locationId,
					time,
					side,
					createdAt: new Date(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		yield* transactionPatchFx({
			messageThreadId,
		});

		return yield* transactionLocationFetchFx({
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type transactionLocationCreateFx = ReturnType<
	typeof transactionLocationCreateFx
>;
