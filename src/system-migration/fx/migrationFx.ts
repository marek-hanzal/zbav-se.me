import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export const migrationFx = Effect.fn("migrationFx")(function* () {
	const { migrate } = yield* KyselyContextFx;

	return yield* Effect.promise(migrate);
});
