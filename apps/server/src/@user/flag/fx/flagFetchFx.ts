import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFlagQueryBuilderFx } from "~/app/flag/db/withFlagQueryBuilderFx";
import { withFlagSelectFx } from "~/app/flag/db/withFlagSelectFx";
import type { FlagQuerySchema } from "~/app/flag/schema/FlagQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { FlagSchema } from "../schema/FlagSchema";

export namespace flagFetchFx {
	export type Props = FlagQuerySchema.Type;
}

export const flagFetchFx = Effect.fn("flagFetchFx")(function* ({
	filter,
	where,
	sort,
}: flagFetchFx.Props) {
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "flag",
		select: yield* withFlagSelectFx({
			sort,
		}),
		output: FlagSchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withFlagQueryBuilderFx,
	});
});

export type flagFetchFx = ReturnType<typeof flagFetchFx>;
