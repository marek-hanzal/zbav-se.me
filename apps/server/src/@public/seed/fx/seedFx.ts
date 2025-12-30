import { z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { seedTransactionInteractionFx } from "~/@public/seed/fx/seedTransactionInteractionFx";
import { SeedTransactionsRequestSchema } from "~/@public/seed/fx/seedTransactionsFx";
import { transactionFx } from "~/@public/seed/fx/transactionFx";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export const SeedRequestSchema = z.object({
	user: z.string().openapi({
		description: "User data for seeding",
		example: "marek.hanzal@x32.cz",
	}),
	transaction: SeedTransactionsRequestSchema,
});

type SeedRequestSchema = typeof SeedRequestSchema;

namespace SeedRequestSchema {
	export type Type = z.infer<SeedRequestSchema>;
}

export const seedFx = ({ user, transaction }: SeedRequestSchema.Type) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const current = yield* Effect.tryPromise(async () => {
			return database
				.selectFrom("user")
				.where("email", "=", user)
				.selectAll()
				.executeTakeFirst();
		});

		if (!current) {
			return yield* new NotFoundError({
				resource: "user",
				resourceId: user,
				message: "User not found",
			});
		}

		yield* transactionFx({
			transaction,
		}).pipe(UserContextProvider(current));

		yield* seedTransactionInteractionFx({}).pipe(UserContextProvider(current));

		return yield* Effect.void;
	});
};
