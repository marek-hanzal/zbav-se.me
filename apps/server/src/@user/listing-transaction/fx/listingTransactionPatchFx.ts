import { Effect } from "effect";
import { DateTime } from "luxon";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { AccessDeniedError } from "~/error/AccessDeniedError";
import { NotFoundError } from "~/error/NotFoundError";
import { ListingTransactionContextFx } from "./ListingTransactionContextFx";
import { listingTransactionFetchFx } from "./listingTransactionFetchFx";

export namespace listingTransactionPatchFx {
	export interface Props {
		listingTransactionId: string;
	}
}

export const listingTransactionPatchFx = ({
	listingTransactionId,
}: listingTransactionPatchFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;
			const config = yield* ListingTransactionContextFx;

			const transaction = yield* Effect.tryPromise(async () => {
				return database
					.selectFrom("listing_transaction as lt")
					.innerJoin("listing as l", "l.id", "lt.listingId")
					.select([
						"lt.userId",
						"l.userId as listingUserId",
					])
					.where("lt.id", "=", listingTransactionId)
					.executeTakeFirst();
			});

			if (!transaction) {
				return yield* new NotFoundError({
					resource: "listing_transaction",
					resourceId: listingTransactionId,
					message: "Transaction not found",
				});
			}

			if (transaction.userId !== user.id && transaction.listingUserId !== user.id) {
				return yield* new AccessDeniedError({
					message: "You are not allowed to modify this transaction",
				});
			}

			const now = DateTime.now();

			yield* Effect.tryPromise(async () => {
				return database
					.updateTable("listing_transaction")
					.set({
						updatedAt: now.toJSDate(),
						expiresAt: now
							.plus({
								days: config.extend,
							})
							.toJSDate(),
					})
					.where("id", "=", listingTransactionId)
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			return yield* listingTransactionFetchFx({
				query: {
					where: {
						id: listingTransactionId,
					},
				},
			});
		}),
	);
};

export type listingTransactionPatchFx = ReturnType<typeof listingTransactionPatchFx>;
