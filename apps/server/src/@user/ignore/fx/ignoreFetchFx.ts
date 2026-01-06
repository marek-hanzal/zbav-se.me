import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withIgnoreQueryBuilderFx } from "~/app/ignore/db/withIgnoreQueryBuilderFx";
import { withIgnoreSelectFx } from "~/app/ignore/db/withIgnoreSelectFx";
import type { IgnoreQuerySchema } from "~/app/ignore/schema/IgnoreQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { IgnoreSchema } from "../schema/IgnoreSchema";

export namespace ignoreFetchFx {
	export type Props = IgnoreQuerySchema.Type;
}

export const ignoreFetchFx = Effect.fn("ignoreFetchFx")(function* ({
	filter,
	where,
	sort,
}: ignoreFetchFx.Props) {
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "ignore",
		select: yield* withIgnoreSelectFx({
			sort,
		}),
		output: IgnoreSchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withIgnoreQueryBuilderFx,
	});
});

export type ignoreFetchFx = ReturnType<typeof ignoreFetchFx>;
