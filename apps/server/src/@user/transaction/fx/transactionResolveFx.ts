import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { traceLogFx } from "~/effect/traceLogFx";
import { AccessDeniedErrorFx } from "~/error/AccessDeniedErrorFx";
import { RuntimeErrorFx } from "~/error/RuntimeErrorFx";

export namespace transactionResolveFx {
	export interface Props {
		userId: string;
		transactionId: string;
		message?: string;
	}
}

export const transactionResolveFx = Effect.fn("transactionResolveFx")(function* ({
	userId,
	transactionId,
	message = "You are not allowed to access this transaction",
}: transactionResolveFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "transactionResolveFx",
		input: {
			userId,
			transactionId,
			message,
		},
	});

	const { kysely } = yield* KyselyContextFx;

	const transaction = yield* tryDbFx(async () =>
		kysely
			.selectFrom("transaction as lt")
			.innerJoin("listing as l", "lt.listingId", "l.id")
			.innerJoin("transaction_user as tu", "tu.transactionId", "lt.id")
			.select([
				"lt.id",
				"lt.listingId",
				"l.userId as sellerId",
				"lt.userId as buyerId",
				"tu.side",
				"lt.status",
			])
			/**
			 * For which transaction we want to resolve
			 */
			.where("lt.id", "=", transactionId)
			.where("tu.userId", "=", userId)
			.executeTakeFirst(),
	);

	if (!transaction) {
		yield* traceLogFx({
			level: "trace",
			message: "transactionResolveFx",
			error: {
				message,
			},
		});
		return yield* new AccessDeniedErrorFx({
			message,
		});
	}

	if (!transaction.status) {
		yield* traceLogFx({
			level: "trace",
			message: "transactionResolveFx",
			error: {
				message: "Transaction status is missing",
			},
		});
		return yield* new RuntimeErrorFx({
			message: "Transaction status is missing",
		});
	}

	return transaction;
});

export type transactionResolveFx = ReturnType<typeof transactionResolveFx>;
