import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessagePackageQueryBuilder } from "~/app/message-package/db/withMessagePackageQueryBuilder";
import { withMessagePackageSelect } from "~/app/message-package/db/withMessagePackageSelect";
import type { MessagePackageQuerySchema } from "~/app/message-package/schema/MessagePackageQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { MessagePackageSchema } from "../schema/MessagePackageSchema";

export namespace messagePackageFetchFx {
	export type Props = MessagePackageQuerySchema.Type;
}

export const messagePackageFetchFx = Effect.fn("messagePackageFetchFx")(function* ({
	filter,
	where,
	sort,
}: messagePackageFetchFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "message-package",
		select: withMessagePackageSelect({
			database,
			sort,
			userId: user.id,
		}),
		output: MessagePackageSchema,
		filter,
		where,
		query: withMessagePackageQueryBuilder,
	});
});

export type messagePackageFetchFx = ReturnType<typeof messagePackageFetchFx>;
