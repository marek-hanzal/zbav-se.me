import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withDraftCollectionSelectFx } from "~/app/draft/db/withDraftCollectionSelectFx";
import { withDraftQueryBuilderFx } from "~/app/draft/db/withDraftQueryBuilderFx";
import type { DraftCountQuerySchema } from "~/app/draft/schema/DraftCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace draftCountFx {
	export type Props = DraftCountQuerySchema.Type;
}

export const draftCountFx = Effect.fn("draftCountFx")(function* ({
	filter,
	where,
}: draftCountFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCountFx({
		selectFx: withDraftCollectionSelectFx({}),
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withDraftQueryBuilderFx,
	});
});

export type draftCountFx = ReturnType<typeof draftCountFx>;
