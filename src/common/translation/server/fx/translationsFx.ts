import { Effect } from "effect";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import type { LocaleSchema } from "../schema/LocaleSchema";

export namespace translationsFx {
	export interface Props extends LocaleSchema.Type {
		//
	}
}

export const translationsFx = Effect.fn("translationsFx")(function* ({
	locale,
}: translationsFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	return yield* tryDbFx(async () => {
		return kysely
			.selectFrom("translation as t")
			.selectAll("t")
			.where("t.locale", "=", locale)
			.execute();
	});
});

export type translationsFx = ReturnType<typeof translationsFx>;
