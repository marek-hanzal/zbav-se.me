import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { MessageTextSchema } from "~/@user/message-text/schema/MessageTextSchema";
import { withMessageTextQueryBuilder } from "~/app/message-text/db/withMessageTextQueryBuilder";
import { withMessageTextSelect } from "~/app/message-text/db/withMessageTextSelect";
import type { MessageTextQuerySchema } from "~/app/message-text/schema/MessageTextQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace messageTextFetchFx {
	export type Props = MessageTextQuerySchema.Type;
}

export const messageTextFetchFx = (query: messageTextFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withMessageTextSelect({
					database,
					sort,
					userId: user.id,
				}),
				output: MessageTextSchema,
				filter,
				where,
				query: withMessageTextQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "message-text",
				resourceId: "(query)",
				message: "Message text not found",
			});
		}

		return data;
	});
};

export type messageTextFetchFx = ReturnType<typeof messageTextFetchFx>;
