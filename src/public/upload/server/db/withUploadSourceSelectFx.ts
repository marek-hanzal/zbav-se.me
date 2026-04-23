import { Effect } from "effect";
import { match } from "ts-pattern";
import type { UploadSortSchema } from "~/public/upload/server/schema/UploadSortSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export namespace withUploadSourceSelectFx {
	export interface Props {
		sort?: UploadSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withUploadSourceSelectFx>>;
}

export const withUploadSourceSelectFx = Effect.fn("withUploadSourceSelectFx")(function* ({
	sort,
}: withUploadSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("upload as u").where("u.access", "=", "public");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("u.createdAt", item.order))
			.exhaustive();
	}

	return query;
});
