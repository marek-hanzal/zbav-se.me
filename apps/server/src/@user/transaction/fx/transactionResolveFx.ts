import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { AccessDeniedError } from "~/error/AccessDeniedError";
import { RuntimeError } from "~/error/RuntimeError";

export namespace transactionResolveFx {
	export interface Props {
		transactionId: string;
		message?: string;
	}
}

export const transactionResolveFx = ({
	transactionId,
	message = "You are not allowed to access this transaction",
}: transactionResolveFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const transaction = yield* Effect.tryPromise(async () => {
			return (
				database
					.selectFrom("transaction as lt")
					.innerJoin("listing as l", "lt.listingId", "l.id")
					.select([
						"lt.id",
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
							eb("lt.userId", "=", user.id),
							eb("l.userId", "=", user.id),
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
			return yield* new RuntimeError({
				message: "Transaction status is missing",
			});
		}

		return {
			transactionId: transaction.id,
			buyerId: transaction.buyerId,
			sellerId: transaction.sellerId,
			side: transaction.buyerId === user.id ? "buyer" : "seller",
			status: transaction.status,
		} as const;
	});
};

export type transactionResolveFx = ReturnType<typeof transactionResolveFx>;
