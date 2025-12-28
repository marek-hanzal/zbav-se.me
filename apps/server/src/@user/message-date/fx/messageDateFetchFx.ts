import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageDateQueryBuilder } from "~/app/message-date/db/withMessageDateQueryBuilder";
import { withMessageDateSelect } from "~/app/message-date/db/withMessageDateSelect";
import type { MessageDateQuerySchema } from "~/app/message-date/schema/MessageDateQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { MessageDateSchema } from "../schema/MessageDateSchema";

export namespace messageDateFetchFx {
	export type Props = MessageDateQuerySchema.Type;
}

export const messageDateFetchFx = (query: messageDateFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withMessageDateSelect({
					database,
					sort,
					userId: user.id,
				}),
				output: MessageDateSchema,
				filter,
				where,
				query: withMessageDateQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "message-date",
				resourceId: "(query)",
				message: "Message date not found",
			});
		}

		return data;
	});
};

export type messageDateFetchFx = ReturnType<typeof messageDateFetchFx>;
