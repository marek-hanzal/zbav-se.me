import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { TransactionStatusCreateSchema } from "~/@common/transaction-status/schema/TransactionStatusCreateSchema";
import { transactionPatchFx } from "~/@seller-user/transaction/fx/transactionPatchFx";
import { transactionStatusFetchFx } from "~/@session/transaction-status/fx/transactionStatusFetchFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace transactionStatusCreateFx {
	export interface Props extends TransactionStatusCreateSchema.Type {
		userId: string;
		listingId: string;
	}
}

export const transactionStatusCreateFx = Effect.fn("transactionStatusCreateFx")(function* ({
	userId,
	...create
}: transactionStatusCreateFx.Props) {
	yield* withTraceFx({
		fx: "transactionStatusCreateFx",
		input: {
			userId,
			...create,
		},
	});

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const id = genId();
	const now = dateContext.now();

	yield* Effect.promise(async () => {
		return kysely
			.insertInto("transaction_status")
			.values({
				...create,
				id,
				userId,
				createdAt: now.toJSDate(),
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
