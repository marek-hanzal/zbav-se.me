import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { AccessDeniedErrorFx } from "~/server/error/AccessDeniedErrorFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";

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
	const logger = yield* getLoggerFx("transactionResolveFx");
	logger.trace("transactionResolveFx", {
		userId,
		transactionId,
		message,
	});

	const transaction = yield* dbFx(async (kysely) => {
		return (
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
				.executeTakeFirst()
		);
	});

	if (!transaction) {
		return yield* new AccessDeniedErrorFx({
			message,
		});
	}

	if (!transaction.status) {
		return yield* new RuntimeErrorFx({
			message: "Transaction status is missing",
		});
	}

	return transaction;
});

export type transactionResolveFx = ReturnType<typeof transactionResolveFx>;
