import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { withMessageThreadQueryBuilder } from "../db/withMessageThreadQueryBuilder";
import { withMessageThreadSelect } from "../db/withMessageThreadSelect";
import type { MessageThreadQuerySchema } from "../schema/MessageThreadQuerySchema";
import { MessageThreadSchema } from "../schema/MessageThreadSchema";

export namespace messageThreadFetchFx {
	export interface Props {
		query: Omit<MessageThreadQuerySchema.Type, "cursor">;
	}
}

export const messageThreadFetchFx = ({ query }: messageThreadFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withMessageThreadSelect({
					database,
					sort,
				}),
				output: MessageThreadSchema,
				filter,
				where,
				query: withMessageThreadQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "messageThread",
				resourceId: "(query)",
				message: "Message thread not found",
			});
		}

		return data;
	});
};

export type messageThreadFetchFx = ReturnType<typeof messageThreadFetchFx>;
