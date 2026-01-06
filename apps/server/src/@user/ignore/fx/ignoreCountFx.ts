import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withIgnoreQueryBuilder } from "~/app/ignore/db/withIgnoreQueryBuilder";
import { withIgnoreSelect } from "~/app/ignore/db/withIgnoreSelect";
import type { IgnoreCountQuerySchema } from "~/app/ignore/schema/IgnoreCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace ignoreCountFx {
	export type Props = IgnoreCountQuerySchema.Type;
}

export const ignoreCountFx = Effect.fn("ignoreCountFx")(function* ({
	filter,
	where,
}: ignoreCountFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withCountFx({
		select: withIgnoreSelect({
			database,
			sort: undefined,
		}),
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query: withIgnoreQueryBuilder,
	});
});

export type ignoreCountFx = ReturnType<typeof ignoreCountFx>;
