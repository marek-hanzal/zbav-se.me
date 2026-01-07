import { z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { listingOfFx } from "~/@public/seed/fx/listingOfFx";
import { transactionCreateFx } from "~/app/transaction/fx/transactionCreateFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

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
	export interface Props extends z.infer<typeof SeedTransactionsRequestSchema> {
		userId: string;
	}
}

export const seedTransactionsFx = Effect.fn("seedTransactionsFx")(function* ({
	userId,
	count,
	months,
}: seedTransactionsFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	yield* Effect.promise(async () => {
		return kysely.deleteFrom("transaction").where("userId", "=", userId).execute();
	});

	const { data: listings } = yield* listingOfFx({
		userId,
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
			userId,
			listingId: listing.id,
			createdAt,
		});
	}

	return yield* Effect.void;
});
