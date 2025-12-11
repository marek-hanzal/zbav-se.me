import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { withMessageQueryBuilder } from "../db/withMessageQueryBuilder";
import { withMessageSelect } from "../db/withMessageSelect";
import type { MessageQuerySchema } from "../schema/MessageQuerySchema";
import { MessageSchema } from "../schema/MessageSchema";

export namespace messageFetchFx {
	export interface Props {
		query: Omit<MessageQuerySchema.Type, "cursor">;
	}
}

export const messageFetchFx = ({ query }: messageFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withMessageSelect({
					database,
					sort,
				}),
				output: MessageSchema,
				filter,
				where,
				query: withMessageQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "message",
				resourceId: "(query)",
				message: "Message not found",
			});
		}

		return data;
	});
};

export type messageFetchFx = ReturnType<typeof messageFetchFx>;
