import { withCollectionFx } from "@use-pico/common/collection";
import { EntitySchema } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withDraftCollectionSelectFx } from "~/app/draft/db/withDraftCollectionSelectFx";
import { withDraftQueryBuilder } from "~/app/draft/db/withDraftQueryBuilder";
import type { DraftQuerySchema } from "~/app/draft/schema/DraftQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace draftCollectionFx {
	export type Props = DraftQuerySchema.Type;
}

export const draftCollectionFx = Effect.fn("draftCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: draftCollectionFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
		select: yield* withDraftCollectionSelectFx({
			database,
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
		query: withDraftQueryBuilder,
	});
});

export type draftCollectionFx = ReturnType<typeof draftCollectionFx>;
