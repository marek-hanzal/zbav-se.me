import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFlagQueryBuilderFx } from "~/app/flag/db/withFlagQueryBuilderFx";
import { withFlagSelectFx } from "~/app/flag/db/withFlagSelectFx";
import type { FlagCountQuerySchema } from "~/app/flag/schema/FlagCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace flagCountFx {
	export type Props = FlagCountQuerySchema.Type;
}

export const flagCountFx = Effect.fn("flagCountFx")(function* ({
	filter,
	where,
}: flagCountFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCountFx({
		select: yield* withFlagSelectFx({}),
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withFlagQueryBuilderFx,
	});
});

export type flagCountFx = ReturnType<typeof flagCountFx>;
