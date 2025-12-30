import { z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { transactionCollectionFx } from "~/@user/transaction/fx/transactionCollectionFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export const SeedTransactionInteractionRequestSchema = z.object({
	//
});

export namespace SeedTransactionInteractionRequestSchema {
	export type Props = z.infer<typeof SeedTransactionInteractionRequestSchema>;
}

export const seedTransactionInteractionFx = (_: SeedTransactionInteractionRequestSchema.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const transactions = yield* transactionCollectionFx({
			cursor: {
				page: 0,
				size: 1000,
			},
		});

        
	});
};
