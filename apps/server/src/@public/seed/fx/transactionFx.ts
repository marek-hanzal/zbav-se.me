import { z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export const TransactionRequestSchema = z.object({
	transaction: z.string().openapi({
		description: "Transaction data for seeding",
	}),
});

type TransactionRequestSchema = typeof TransactionRequestSchema;

namespace TransactionRequestSchema {
	export type Type = z.infer<TransactionRequestSchema>;
}

export namespace transactionFx {
	export type Props = TransactionRequestSchema.Type;
}

export const transactionFx = ({ transaction }: transactionFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		yield* Effect.tryPromise(async () => {
			return database.deleteFrom("transaction").where("userId", "=", user.id).execute();
		});

        
	});
};
