import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { MessageSystemSchema } from "~/@user/message-system/schema/MessageSystemSchema";
import { withMessageSystemQueryBuilder } from "~/app/message-system/db/withMessageSystemQueryBuilder";
import { withMessageSystemSelect } from "~/app/message-system/db/withMessageSystemSelect";
import type { MessageSystemQuerySchema } from "~/app/message-system/schema/MessageSystemQuerySchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace messageSystemFetchFx {
	export type Props = MessageSystemQuerySchema.Type;
}

export const messageSystemFetchFx = (query: messageSystemFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withMessageSystemSelect({
					database,
					sort,
				}),
				output: MessageSystemSchema,
				filter,
				where,
				query: withMessageSystemQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "message-system",
				resourceId: "(query)",
				message: "Message system not found",
			});
		}

		return data;
	});
};

export type messageSystemFetchFx = ReturnType<typeof messageSystemFetchFx>;
