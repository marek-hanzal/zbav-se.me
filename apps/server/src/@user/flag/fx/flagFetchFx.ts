import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFlagQueryBuilder } from "~/app/flag/db/withFlagQueryBuilder";
import { withFlagSelectFx } from "~/app/flag/db/withFlagSelectFx";
import type { FlagQuerySchema } from "~/app/flag/schema/FlagQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { FlagSchema } from "../schema/FlagSchema";

export namespace flagFetchFx {
	export type Props = FlagQuerySchema.Type;
}

export const flagFetchFx = Effect.fn("flagFetchFx")(function* ({
	filter,
	where,
	sort,
}: flagFetchFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "flag",
		select: yield* withFlagSelectFx({
			database,
			sort,
		}),
		output: FlagSchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query: withFlagQueryBuilder,
	});
});

export type flagFetchFx = ReturnType<typeof flagFetchFx>;
