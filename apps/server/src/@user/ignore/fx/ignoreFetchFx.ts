import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withIgnoreQueryBuilder } from "~/app/ignore/db/withIgnoreQueryBuilder";
import { withIgnoreSelectFx } from "~/app/ignore/db/withIgnoreSelectFx";
import type { IgnoreQuerySchema } from "~/app/ignore/schema/IgnoreQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { IgnoreSchema } from "../schema/IgnoreSchema";

export namespace ignoreFetchFx {
	export type Props = IgnoreQuerySchema.Type;
}

export const ignoreFetchFx = Effect.fn("ignoreFetchFx")(function* ({
	filter,
	where,
	sort,
}: ignoreFetchFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "ignore",
		select: yield* withIgnoreSelectFx({
			database,
			sort,
		}),
		output: IgnoreSchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withIgnoreQueryBuilder,
	});
});

export type ignoreFetchFx = ReturnType<typeof ignoreFetchFx>;
