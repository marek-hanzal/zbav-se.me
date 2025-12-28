import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { MessagePersonalSchema } from "~/@user/message-personal/schema/MessagePersonalSchema";
import { withMessagePersonalQueryBuilder } from "~/app/message-personal/db/withMessagePersonalQueryBuilder";
import { withMessagePersonalSelect } from "~/app/message-personal/db/withMessagePersonalSelect";
import type { MessagePersonalQuerySchema } from "~/app/message-personal/schema/MessagePersonalQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace messagePersonalFetchFx {
	export type Props = MessagePersonalQuerySchema.Type;
}

export const messagePersonalFetchFx = (query: messagePersonalFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withMessagePersonalSelect({
					database,
					sort,
					userId: user.id,
				}),
				output: MessagePersonalSchema,
				filter,
				where,
				query: withMessagePersonalQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "message_personal",
				resourceId: "(query)",
				message: "Message personal not found",
			});
		}

		return data;
	});
};

export type messagePersonalFetchFx = ReturnType<typeof messagePersonalFetchFx>;
