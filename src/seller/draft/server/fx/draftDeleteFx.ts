import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { draftFetchFx } from "~/seller/draft/server/fx/draftFetchFx";
import type { DraftFilterSchema } from "~/seller/draft/server/schema/DraftFilterSchema";
import type { DraftQuerySchema } from "~/seller/draft/server/schema/DraftQuerySchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace draftDeleteFx {
	export interface Scope extends DraftFilterSchema.Type {
		userId: string;
	}

	export interface Props extends Omit<DraftQuerySchema.Type, "cursor" | "sort"> {
		scope: Scope;
	}
}

export const draftDeleteFx = Effect.fn("draftDeleteFx")(function* (query: draftDeleteFx.Props) {
	const logger = yield* getLoggerFx("draftDeleteFx");
	logger.trace("draftDeleteFx", {
		...query,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const draft = yield* draftFetchFx(query);

			yield* tryDbFx(async () =>
				kysely.deleteFrom("draft").where("id", "=", draft.id).execute(),
			);

			return draft;
		}),
	);
});

export type draftDeleteFx = ReturnType<typeof draftDeleteFx>;
