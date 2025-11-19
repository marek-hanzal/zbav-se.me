import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { UserContextFx } from "../../../auth/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withTransactionFx } from "../../../database/fx/withTransactionFx";
import { NotFoundError } from "../../../error/NotFoundError";
import { listingTransactionLogCreateFx } from "../../listing-transaction-log/fx/listingTransactionLogCreateFx";
import { listingTransactionFetchFx } from "./listingTransactionFetchFx";

export namespace listingTransactionCreateFx {
	export interface Props {
		listingId: string;
	}
}

export const listingTransactionCreateFx = ({ listingId }: listingTransactionCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			const listing = yield* Effect.tryPromise(async () => {
				return database
					.selectFrom("listing")
					.select([
						"id",
						"userId",
					])
					.where("id", "=", listingId)
					.executeTakeFirst();
			});

			if (!listing) {
				return yield* new NotFoundError({
					resource: "listing",
					resourceId: listingId,
					message: "Listing not found",
				});
			}

			const now = DateTime.now();
			const expiresAt = now.plus({
				days: 3,
			});
			const nowDate = now.toJSDate();
			const expiresAtDate = expiresAt.toJSDate();
			const id = genId();

			yield* Effect.tryPromise(async () => {
				return database
					.insertInto("listing_transaction")
					.values({
						id,
						userId: user.id,
						listingId,
						side: "buyer",
						status: "request",
						createdAt: nowDate,
						updatedAt: nowDate,
						expiresAt: expiresAtDate,
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			yield* listingTransactionLogCreateFx({
				listingTransactionId: id,
				side: "buyer",
				status: "request",
				createdAt: nowDate,
			});

			return yield* listingTransactionFetchFx({
				query: {
					where: {
						id,
					},
				},
			});
		}),
	);
};

export type listingTransactionCreateFx = ReturnType<typeof listingTransactionCreateFx>;
