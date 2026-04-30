import { Effect } from "effect";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export const translationsFx = Effect.fn("translationsFx")(function* () {
	const { kysely } = yield* KyselyContextFx;

	//
});
