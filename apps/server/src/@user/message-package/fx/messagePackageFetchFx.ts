import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessagePackageQueryBuilderFx } from "~/@user/message-package/db/withMessagePackageQueryBuilderFx";
import { withMessagePackageSelectFx } from "~/@user/message-package/db/withMessagePackageSelectFx";
import type { MessagePackageFilterSchema } from "~/@user/message-package/schema/MessagePackageFilterSchema";
import type { MessagePackageQuerySchema } from "~/@user/message-package/schema/MessagePackageQuerySchema";

export namespace messagePackageFetchFx {
	export interface Props extends MessagePackageQuerySchema.Type {
		userId: string;
		scope: MessagePackageFilterSchema.Type;
	}
}

export const messagePackageFetchFx = Effect.fn("messagePackageFetchFx")(function* ({
	userId,
	filter,
	where,
	scope,
	sort,
}: messagePackageFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message-package",
		selectFx: withMessagePackageSelectFx({
			userId,
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withMessagePackageQueryBuilderFx,
	});
});

export type messagePackageFetchFx = ReturnType<typeof messagePackageFetchFx>;
