import { Effect } from "effect";
import { sql } from "kysely";
import { withUploadSourceSelectFx } from "~/public/upload/server/db/withUploadSourceSelectFx";

export namespace withUploadSelectFx {
	export interface Props extends withUploadSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withUploadSelectFx>>;
}

export const withUploadSelectFx = Effect.fn("withUploadSelectFx")(function* ({
	sort,
}: withUploadSelectFx.Props) {
	const sourceSelect = yield* withUploadSourceSelectFx({
		sort,
	});

	return sourceSelect.select([
		"u.id",
		"u.url",
		(eb) => {
			return sql<Date>`${eb.ref("u.createdAt")}`.as("createdAt");
		},
	]);
});
