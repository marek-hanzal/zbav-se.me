import { z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { t00_initial } from "~/@public/seed/fx/interaction/t00_initial";
import { t01_resolve } from "~/@public/seed/fx/interaction/t01_resolve";
import { t02_buyerReaction } from "~/@public/seed/fx/interaction/t02_buyerReaction";

export const SeedTransactionInteractionRequestSchema = z.object({
	//
});

export namespace SeedTransactionInteractionRequestSchema {
	export type Props = z.infer<typeof SeedTransactionInteractionRequestSchema>;
}

export const seedTransactionInteractionFx = (_: SeedTransactionInteractionRequestSchema.Props) => {
	return Effect.gen(function* () {
		yield* t00_initial({
			fromMinutes: 5,
			toMinutes: 60 * 24 * 2,
		});

		yield* t01_resolve({
			fromMinutes: 5,
			toMinutes: 60 * 24 * 2,
		});

		yield* t02_buyerReaction({
			fromMinutes: 5,
			toMinutes: 60 * 24 * 2,
		});
	});
};
