import { withCollectionFx } from "@use-pico/common/collection";
import { EntitySchema } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withDraftCollectionSelectFx } from "~/app/draft/db/withDraftCollectionSelectFx";
import { withDraftQueryBuilderFx } from "~/app/draft/db/withDraftQueryBuilderFx";
import type { DraftQuerySchema } from "~/app/draft/schema/DraftQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace draftCollectionFx {
	export type Props = DraftQuerySchema.Type;
}

export const draftCollectionFx = Effect.fn("draftCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: draftCollectionFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
		select: yield* withDraftCollectionSelectFx({
			sort,
		}),
		output: EntitySchema,
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withDraftQueryBuilderFx,
	});
});

export type draftCollectionFx = ReturnType<typeof draftCollectionFx>;
