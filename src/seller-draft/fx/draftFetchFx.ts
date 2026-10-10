import { Effect } from "effect";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withDraftSelectFx } from "~/seller-draft/db/withDraftSelectFx";
import type { DraftQuerySchema } from "~/seller-draft/schema/DraftQuerySchema";
import type { DraftWhereSchema } from "~/seller-draft/schema/DraftWhereSchema";

export namespace draftFetchFx {
	export interface Props extends DraftQuerySchema.Type {
		userId: string;
		scope: DraftWhereSchema.Type;
	}
}

export const draftFetchFx = Effect.fn("draftFetchFx")(function* ({
	userId,
	where,
	scope,
	sort,
}: draftFetchFx.Props) {
	const logger = yield* getLoggerFx("draftFetchFx");
	logger.trace("draftFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "draft",
		selectFx: withDraftSelectFx({
			userId,
			sort,
		}),
		where,
		scope,
	});
});

export type draftFetchFx = ReturnType<typeof draftFetchFx>;
