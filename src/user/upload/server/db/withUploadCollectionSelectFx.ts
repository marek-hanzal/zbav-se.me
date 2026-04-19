import { Effect } from "effect";
import { withUploadSourceSelectFx } from "~/user/upload/server/db/withUploadSourceSelectFx";

export namespace withUploadCollectionSelectFx {
	export interface Props extends withUploadSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withUploadCollectionSelectFx>>;
}

export const withUploadCollectionSelectFx = Effect.fn("withUploadCollectionSelectFx")(function* ({
	sort,
}: withUploadCollectionSelectFx.Props) {
	const sourceSelect = yield* withUploadSourceSelectFx({
		sort,
	});

	return sourceSelect.select([
		"u.id",
		"u.url",
	]);
});
