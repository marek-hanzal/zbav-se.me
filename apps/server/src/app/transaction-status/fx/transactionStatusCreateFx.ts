import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { transactionPatchFx } from "~/app/transaction/fx/transactionPatchFx";
import { transactionStatusFetchFx } from "~/app/transaction-status/fx/transactionStatusFetchFx";
import type { TransactionStatusCreateSchema } from "~/app/transaction-status/schema/TransactionStatusCreateSchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace transactionStatusCreateFx {
	export interface Props extends TransactionStatusCreateSchema.Type {
		userId: string;
		listingId: string;
		createdAt?: DateTime;
	}
}

export const transactionStatusCreateFx = Effect.fn("transactionStatusCreateFx")(function* ({
	userId,
	createdAt,
	...create
}: transactionStatusCreateFx.Props) {
	const database = yield* DatabaseContextFx;

	const id = genId();

	yield* Effect.promise(async () => {
		return database
			.insertInto("transaction_status")
			.values({
				...create,
				id,
				userId,
				createdAt: (createdAt ?? DateTime.now()).toJSDate(),
			})
			.returningAll()
			.executeTakeFirstOrThrow();
	});

	yield* transactionPatchFx({
		userId,
		patch: {},
		query: {
			where: {
				id: create.transactionId,
			},
		},
		updatedAt: createdAt ?? DateTime.now(),
		scope: {
			userId,
		},
	});

	return yield* transactionStatusFetchFx({
		where: {
			id,
		},
		scope: {},
	});
});

export type transactionStatusCreateFx = ReturnType<typeof transactionStatusCreateFx>;

type _NoUser = AssertNever<
	Extract<Effect.Effect.Context<transactionStatusCreateFx>, UserContextFx>
>;
