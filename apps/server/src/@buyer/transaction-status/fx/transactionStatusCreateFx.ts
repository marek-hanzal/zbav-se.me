import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { transactionPatchFx } from "~/@buyer/transaction/fx/transactionPatchFx";
import type { TransactionStatusCreateSchema } from "~/@common/transaction-status/schema/TransactionStatusCreateSchema";
import { transactionStatusFetchFx } from "~/@session/transaction-status/fx/transactionStatusFetchFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
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
	const latestStatus = yield* tryDbFx(async () =>
		kysely
			.selectFrom("transaction_status as ts")
			.select("ts.createdAt")
			.where("ts.transactionId", "=", create.transactionId)
			.orderBy("ts.createdAt", "desc")
			.limit(1)
			.executeTakeFirst(),
	);
	const createdAt =
		latestStatus && latestStatus.createdAt.getTime() >= now.toMillis()
			? new Date(latestStatus.createdAt.getTime() + 1)
			: now.toJSDate();

	yield* tryDbFx(async () =>
		kysely
			.insertInto("transaction_status")
			.values({
				...create,
				id,
				userId,
				createdAt,
			})
			.returningAll()
			.executeTakeFirstOrThrow(),
	);

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
