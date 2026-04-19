import { Effect } from "effect";
import { sql } from "kysely";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withUploadQueryBuilderFx } from "~/user/upload/server/db/withUploadQueryBuilderFx";
import { withUploadSourceSelectFx } from "~/user/upload/server/db/withUploadSourceSelectFx";
import type { UploadCountQuerySchema } from "~/user/upload/server/schema/UploadCountQuerySchema";
import type { UploadFilterSchema } from "~/user/upload/server/schema/UploadFilterSchema";

export namespace uploadCountFx {
	export interface Props extends UploadCountQuerySchema.Type {
		scope: UploadFilterSchema.Type;
	}
}

export const uploadCountFx = Effect.fn("uploadCountFx")(function* ({
	filter,
	where,
	scope,
}: uploadCountFx.Props) {
	const logger = yield* getLoggerFx("uploadCountFx");
	logger.trace("uploadCountFx", {
		filter,
		where,
		scope,
	});

	const hasFilter = !!(filter && Object.keys(filter).length > 0);
	const hasWhere = !!(where && Object.keys(where).length > 0);

	if (!hasFilter && !hasWhere) {
		const { kysely } = yield* KyselyContextFx;

		let query = kysely.selectFrom("upload as u");
		if (scope?.userId) {
			query = query.where("u.userId", "=", scope.userId);
		}

		const { count } = yield* Effect.promise(async () => {
			return query.select(sql<number>`count(*)::int`.as("count")).executeTakeFirstOrThrow();
		});

		return count;
	}

	return yield* withCountFx({
		selectFx: withUploadSourceSelectFx({
			sort: [],
		}),
		filter,
		where,
		scope,
		queryFx: withUploadQueryBuilderFx,
	});
});

export type uploadCountFx = ReturnType<typeof uploadCountFx>;
