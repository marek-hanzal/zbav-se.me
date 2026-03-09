import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { TransactionStatusCreateSchema } from "~/@common/transaction-status/schema/TransactionStatusCreateSchema";
import { transactionStatusFetchFx } from "~/@session/transaction-status/fx/transactionStatusFetchFx";
import { transactionEntryCleanupSensitiveFx } from "~/@user/transaction-entry/fx/transactionEntryCleanupSensitiveFx";
import { withTransactionStatusEntryFx } from "~/@user/transaction-entry/fx/withTransactionStatusEntryFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { traceLogFx } from "~/effect/traceLogFx";

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
	yield* traceLogFx({
		level: "trace",
		message: "transactionStatusCreateFx",
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

	yield* withTransactionStatusEntryFx({
		transactionId: create.transactionId,
		userId,
		scopeUserId: userId,
		status: create.status,
		side: create.side,
	});

	if (
		create.status === "rejected" ||
		create.status === "expired" ||
		create.status === "success" ||
		create.status === "closed"
	) {
		yield* transactionEntryCleanupSensitiveFx({
			transactionId: create.transactionId,
		});
	}

	return yield* transactionStatusFetchFx({
		where: {
			id,
		},
		scope: {},
	});
});

export type transactionStatusCreateFx = ReturnType<typeof transactionStatusCreateFx>;
