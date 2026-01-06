import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withDraftCollectionSelectFx } from "~/app/draft/db/withDraftCollectionSelectFx";
import { withDraftQueryBuilder } from "~/app/draft/db/withDraftQueryBuilder";
import type { DraftCountQuerySchema } from "~/app/draft/schema/DraftCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace draftCountFx {
	export type Props = DraftCountQuerySchema.Type;
}

export const draftCountFx = Effect.fn("draftCountFx")(function* ({
	filter,
	where,
}: draftCountFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withCountFx({
		select: yield* withDraftCollectionSelectFx({
			database,
			sort: undefined,
		}),
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query: withDraftQueryBuilder,
	});
});

export type draftCountFx = ReturnType<typeof draftCountFx>;
