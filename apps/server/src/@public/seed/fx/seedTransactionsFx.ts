import { z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { listingOfFx } from "~/@public/seed/fx/listingOfFx";
import { transactionCreateFx } from "~/@user/transaction/fx/transactionCreateFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export const SeedTransactionsRequestSchema = z.object({
	count: z.number().openapi({
		description: "Number of listings to create transactions for",
		example: 25,
	}),
	months: z.number().openapi({
		description: "Number of months to create transactions for",
		example: 12,
	}),
});

export namespace seedTransactionsFx {
	export type Props = z.infer<typeof SeedTransactionsRequestSchema>;
}

export const seedTransactionsFx = ({ count, months }: seedTransactionsFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		yield* Effect.tryPromise(async () => {
			return database.deleteFrom("transaction").where("userId", "=", user.id).execute();
		});

		const { data: listings } = yield* listingOfFx({
			count,
		});

		const now = DateTime.now();
		const startTime = now.minus({
			months,
		});
		const timeSpanMs = now.diff(startTime, "milliseconds").milliseconds;

		for (let i = 0; i < listings.length; i++) {
			const listing = listings[i];
			if (!listing) {
				continue;
			}

			// Distribute evenly across the time period
			const progress = listings.length > 1 ? i / (listings.length - 1) : 0;
			const createdAt = startTime.plus({
				milliseconds: Math.round(timeSpanMs * progress),
			});

			yield* transactionCreateFx({
				listingId: listing.id,
				createdAt,
			});
		}

		return yield* Effect.void;
	});
};
