import { z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { seedTransactionInteractionFx } from "~/@public/seed/fx/seedTransactionInteractionFx";
import { SeedTransactionsRequestSchema } from "~/@public/seed/fx/seedTransactionsFx";
import { seedUserFx } from "~/@public/seed/fx/seedUserFx";
import { transactionFx } from "~/@public/seed/fx/transactionFx";

export const SeedRequestSchema = z.object({
	email: z.string().openapi({
		description: "User data for seeding",
		example: "marek.hanzal@x32.cz",
	}),
	transaction: SeedTransactionsRequestSchema,
});

type SeedRequestSchema = typeof SeedRequestSchema;

namespace SeedRequestSchema {
	export type Type = z.infer<SeedRequestSchema>;
}

export const seedFx = Effect.fn("seedFx")(function* ({
	email,
	transaction,
}: SeedRequestSchema.Type) {
	const current = yield* seedUserFx({
		email,
	});

	yield* transactionFx({
		userId: current.id,
		transaction,
	});

	yield* seedTransactionInteractionFx({
		userId: current.id,
	});

	return yield* Effect.void;
});

export type seedFx = ReturnType<typeof seedFx>;
