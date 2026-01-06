import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { transactionPatchFx } from "~/@user/transaction/fx/transactionPatchFx";
import type { TransactionStatusCreateSchema } from "~/app/transaction-status/schema/TransactionStatusCreateSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { transactionStatusFetchFx } from "./transactionStatusFetchFx";

export namespace transactionStatusCreateFx {
	export interface Props extends TransactionStatusCreateSchema.Type {
		listingId: string;
		createdAt?: DateTime;
	}
}

export const transactionStatusCreateFx = Effect.fn("transactionStatusCreateFx")(function* ({
	createdAt,
	...create
}: transactionStatusCreateFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	const id = genId();

	yield* Effect.promise(async () => {
		return database
			.insertInto("transaction_status")
			.values({
				id,
				...create,
				userId: user.id,
				createdAt: (createdAt ?? DateTime.now()).toJSDate(),
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
		updatedAt: createdAt ?? DateTime.now(),
	});

	return yield* transactionStatusFetchFx({
		where: {
			id,
		},
	});
});

export type transactionStatusCreateFx = ReturnType<typeof transactionStatusCreateFx>;
