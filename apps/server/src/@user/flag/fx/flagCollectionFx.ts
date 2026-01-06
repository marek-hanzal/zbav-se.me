import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withFlagQueryBuilderFx } from "~/app/flag/db/withFlagQueryBuilderFx";
import { withFlagSelectFx } from "~/app/flag/db/withFlagSelectFx";
import type { FlagQuerySchema } from "~/app/flag/schema/FlagQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { FlagSchema } from "../schema/FlagSchema";

export namespace flagCollectionFx {
	export type Props = FlagQuerySchema.Type;
}

export const flagCollectionFx = Effect.fn("flagCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: flagCollectionFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
		select: yield* withFlagSelectFx({
			sort,
		}),
		output: FlagSchema,
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withFlagQueryBuilderFx,
	});
});

export type flagCollectionFx = ReturnType<typeof flagCollectionFx>;
