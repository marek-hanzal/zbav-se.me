import { z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { t00_initial } from "~/@public/seed/fx/interaction/t00_initial";
import { t01_resolve } from "~/@public/seed/fx/interaction/t01_resolve";
import { t02_buyerReaction } from "~/@public/seed/fx/interaction/t02_buyerReaction";
import { t03_sellerReaction } from "~/@public/seed/fx/interaction/t03_sellerReaction";
import { t04_buyerFinish } from "~/@public/seed/fx/interaction/t04_buyerFinish";

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

		yield* t03_sellerReaction({
			fromMinutes: 60 * 6,
			toMinutes: 60 * 24 * 2,
		});

		yield* t04_buyerFinish({
			fromMinutes: 60 * 12,
			toMinutes: 60 * 24 * 2,
		});
	});
};
