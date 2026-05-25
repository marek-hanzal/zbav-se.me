import { Effect } from "effect";
import { dbFx } from "~/server/database/fx/dbFx";
import type { LocaleSchema } from "../schema/LocaleSchema";

export namespace translationsFx {
	export interface Props extends LocaleSchema.Type {
		//
	}
}

export const translationsFx = Effect.fn("translationsFx")(function* ({
	locale,
}: translationsFx.Props) {
	return yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("translation as t")
			.selectAll("t")
			.where("t.locale", "=", locale)
			.execute();
	});
});

export type translationsFx = ReturnType<typeof translationsFx>;
