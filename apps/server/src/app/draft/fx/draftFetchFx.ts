import { withFetchFx } from "@use-pico/common/fetch";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withDraftQueryBuilderFx } from "~/app/draft/db/withDraftQueryBuilderFx";
import { withDraftSelectFx } from "~/app/draft/db/withDraftSelectFx";
import type { DraftFilterSchema } from "~/app/draft/schema/DraftFilterSchema";
import type { DraftQuerySchema } from "~/app/draft/schema/DraftQuerySchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace draftFetchFx {
	export interface Props extends DraftQuerySchema.Type {
		scope: DraftFilterSchema.Type;
	}
}

export const draftFetchFx = Effect.fn("draftFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: draftFetchFx.Props) {
	return yield* withFetchFx({
		resource: "draft",
		selectFx: withDraftSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withDraftQueryBuilderFx,
	});
});

export type draftFetchFx = ReturnType<typeof draftFetchFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<draftFetchFx>, UserContextFx>>;
