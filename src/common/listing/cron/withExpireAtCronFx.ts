import { Effect } from "effect";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export const withExpireAtCronFx = Effect.fn("withExpireAtCronFx")(function* () {
	const { kysely } = yield* KyselyContextFx;
});

export type withExpireAtCronFx = ReturnType<typeof withExpireAtCronFx>;
