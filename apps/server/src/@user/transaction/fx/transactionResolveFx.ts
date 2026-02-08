import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { AccessDeniedError } from "~/error/AccessDeniedError";
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
	yield* Effect.annotateLogsScoped({
		"transactionResolveFx.userId": userId,
		"transactionResolveFx.transactionId": transactionId,
		"transactionResolveFx.message": message,
	});

	const { kysely } = yield* KyselyContextFx;

	const transaction = yield* Effect.promise(async () => {
		return (
			kysely
				.selectFrom("transaction as lt")
				.innerJoin("listing as l", "lt.listingId", "l.id")
				.select([
					"lt.id",
					"lt.listingId",
					"lt.messageThreadId",
					"l.userId as sellerId",
					"lt.userId as buyerId",
				])
				.select((eb) => {
					return eb
						.selectFrom("transaction_status as lts")
						.select("lts.status")
						.whereRef("lts.transactionId", "=", "lt.id")
						.orderBy("lts.createdAt", "desc")
						.limit(1)
						.as("status");
				})
				/**
				 * For which transaction we want to resolve
				 */
				.where("lt.id", "=", transactionId)
				/**
				 * We've to check if current user is on either side of the transaction
				 */
				.where((eb) => {
					return eb.or([
						eb("lt.userId", "=", userId),
						eb("l.userId", "=", userId),
					]);
				})
				.executeTakeFirst()
		);
	});

	if (!transaction) {
		return yield* new AccessDeniedError({
			message,
		});
	}

	if (!transaction.status) {
		return yield* new RuntimeErrorFx({
			message: "Transaction status is missing",
		});
	}

	return {
		...transaction,
		side: transaction.buyerId === userId ? "buyer" : "seller",
	} as const;
});

export type transactionResolveFx = ReturnType<typeof transactionResolveFx>;
