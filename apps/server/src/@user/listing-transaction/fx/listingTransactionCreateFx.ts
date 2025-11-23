import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { UserContextFx } from "../../../auth/fx/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withTransactionFx } from "../../../database/fx/withTransactionFx";
import { NotFoundError } from "../../../error/NotFoundError";
import { listingTransactionStatusCreateFx } from "../../listing-transaction-status/fx/listingTransactionStatusCreateFx";
import { ListingTransactionContextFx } from "./ListingTransactionContextFx";
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
			const config = yield* ListingTransactionContextFx;

			const listing = yield* Effect.tryPromise(async () => {
				return database
					.selectFrom("listing")
					.select([
						"id",
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
						createdAt: DateTime.now().toJSDate(),
						updatedAt: DateTime.now().toJSDate(),
						expiresAt: DateTime.now()
							.plus({
								days: config.expires,
							})
							.toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			yield* listingTransactionStatusCreateFx({
				listingTransactionId: id,
				side: "buyer",
				status: "request",
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
