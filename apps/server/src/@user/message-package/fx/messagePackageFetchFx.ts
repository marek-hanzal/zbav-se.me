import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessagePackageQueryBuilder } from "~/app/message-package/db/withMessagePackageQueryBuilder";
import { withMessagePackageSelect } from "~/app/message-package/db/withMessagePackageSelect";
import type { MessagePackageQuerySchema } from "~/app/message-package/schema/MessagePackageQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { MessagePackageSchema } from "../schema/MessagePackageSchema";

export namespace messagePackageFetchFx {
	export type Props = MessagePackageQuerySchema.Type;
}

export const messagePackageFetchFx = (query: messagePackageFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
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

		if (!data) {
			return yield* new NotFoundError({
				resource: "message-package",
				resourceId: "(query)",
				message: "Message package not found",
			});
		}

		return data;
	});
};

export type messagePackageFetchFx = ReturnType<typeof messagePackageFetchFx>;
