import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { DraftSchema } from "~/@user/draft/schema/DraftSchema";
import { withDraftQueryBuilder } from "~/app/draft/db/withDraftQueryBuilder";
import { withDraftSelectFx } from "~/app/draft/db/withDraftSelectFx";
import type { DraftQuerySchema } from "~/app/draft/schema/DraftQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace draftFetchFx {
	export type Props = DraftQuerySchema.Type;
}

export const draftFetchFx = Effect.fn("draftFetchFx")(function* ({
	filter,
	where,
	sort,
}: draftFetchFx.Props) {
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "draft",
		select: yield* withDraftSelectFx({
			sort,
		}),
		output: DraftSchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query: withDraftQueryBuilder,
	});
});

export type draftFetchFx = ReturnType<typeof draftFetchFx>;
