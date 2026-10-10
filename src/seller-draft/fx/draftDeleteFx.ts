import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { draftFetchFx } from "~/seller-draft/fx/draftFetchFx";
import type { DraftQuerySchema } from "~/seller-draft/schema/DraftQuerySchema";
import type { DraftWhereSchema } from "~/seller-draft/schema/DraftWhereSchema";

export namespace draftDeleteFx {
	export interface Props extends DraftQuerySchema.Type {
		userId: string;
		scope: DraftWhereSchema.Type;
	}
}

export const draftDeleteFx = Effect.fn("draftDeleteFx")(function* ({
	userId,
	...query
}: draftDeleteFx.Props) {
	const logger = yield* getLoggerFx("draftDeleteFx");
	logger.trace("draftDeleteFx", {
		...query,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const draft = yield* draftFetchFx({
				userId,
				...query,
			});

			yield* dbFx(async (kysely) => {
				return kysely.deleteFrom("draft").where("id", "=", draft.id).execute();
			});

			return draft;
		}),
	);
});

export type draftDeleteFx = ReturnType<typeof draftDeleteFx>;
