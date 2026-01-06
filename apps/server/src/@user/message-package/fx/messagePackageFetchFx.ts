import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessagePackageQueryBuilderFx } from "~/app/message-package/db/withMessagePackageQueryBuilderFx";
import { withMessagePackageSelectFx } from "~/app/message-package/db/withMessagePackageSelectFx";
import type { MessagePackageQuerySchema } from "~/app/message-package/schema/MessagePackageQuerySchema";
import { MessagePackageSchema } from "../schema/MessagePackageSchema";

export namespace messagePackageFetchFx {
	export type Props = MessagePackageQuerySchema.Type;
}

export const messagePackageFetchFx = Effect.fn("messagePackageFetchFx")(function* ({
	filter,
	where,
	sort,
}: messagePackageFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message-package",
		select: yield* withMessagePackageSelectFx({
			sort,
		}),
		output: MessagePackageSchema,
		filter,
		where,
		queryFx: withMessagePackageQueryBuilderFx,
	});
});

export type messagePackageFetchFx = ReturnType<typeof messagePackageFetchFx>;
