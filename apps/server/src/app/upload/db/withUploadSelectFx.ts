import { Effect } from "effect";
import { match } from "ts-pattern";
import type { UploadSortSchema } from "~/app/upload/schema/UploadSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withUploadSelectFx {
	export interface Props {
		sort?: UploadSortSchema.Type[];
	}
	export type Select = Effect.Effect.Success<ReturnType<typeof withUploadSelectFx>>;
}

export const withUploadSelectFx = Effect.fn("withUploadSelectFx")(function* ({
	sort,
}: withUploadSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("upload as u").select([
		"u.id",
		"u.url",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("u.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
