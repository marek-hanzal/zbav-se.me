import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import type { MessageQuerySchema } from "~/app/message/schema/MessageQuerySchema";
import { MessageSchema } from "~/app/message/schema/MessageSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { withMessageTextQueryBuilder } from "../db/withMessageTextQueryBuilder";
import { withMessageTextSelect } from "../db/withMessageTextSelect";

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
