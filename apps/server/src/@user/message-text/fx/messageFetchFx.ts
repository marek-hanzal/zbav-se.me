import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageTextQueryBuilder } from "~/app/message/db/withMessageQueryBuilder";
import { withMessageTextSelect } from "~/app/message/db/withMessageSelect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import type { MessageQuerySchema } from "../schema/MessageQuerySchema";
import { MessageSchema } from "../schema/MessageSchema";

export namespace messageTextFetchFx {
	export interface Props {
		query: Omit<MessageQuerySchema.Type, "cursor">;
	}
}

export const messageTextFetchFx = ({ query }: messageTextFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withMessageTextSelect({
					database,
					sort,
				}),
				output: MessageSchema,
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
