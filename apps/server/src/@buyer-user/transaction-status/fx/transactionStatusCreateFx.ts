import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { transactionPatchFx } from "~/@buyer-user/transaction/fx/transactionPatchFx";
import type { TransactionStatusCreateSchema } from "~/@common/transaction-status/schema/TransactionStatusCreateSchema";
import { transactionStatusFetchFx } from "~/@session/transaction-status/fx/transactionStatusFetchFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

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
	yield* Effect.annotateLogsScoped({
		"transactionStatusCreateFx.userId": userId,
		"transactionStatusCreateFx.create": create,
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
