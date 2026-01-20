import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessagePackageQueryBuilderFx } from "~/app/message-package/db/withMessagePackageQueryBuilderFx";
import { withMessagePackageSelectFx } from "~/app/message-package/db/withMessagePackageSelectFx";
import type { MessagePackageFilterSchema } from "~/app/message-package/schema/MessagePackageFilterSchema";
import type { MessagePackageQuerySchema } from "~/app/message-package/schema/MessagePackageQuerySchema";

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
