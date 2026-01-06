import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFlagQueryBuilder } from "~/app/flag/db/withFlagQueryBuilder";
import { withFlagSelect } from "~/app/flag/db/withFlagSelect";
import type { FlagCountQuerySchema } from "~/app/flag/schema/FlagCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace flagCountFx {
	export type Props = FlagCountQuerySchema.Type;
}

export const flagCountFx = Effect.fn("flagCountFx")(function* ({
	filter,
	where,
}: flagCountFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withCountFx({
		select: withFlagSelect({
			database,
			sort: undefined,
		}),
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query: withFlagQueryBuilder,
	});
});

export type flagCountFx = ReturnType<typeof flagCountFx>;
