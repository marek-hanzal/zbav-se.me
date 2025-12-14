import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageLocationQueryBuilder } from "~/app/message-location/db/withMessageLocationQueryBuilder";
import { withMessageLocationSelect } from "~/app/message-location/db/withMessageLocationSelect";
import type { MessageLocationQuerySchema } from "~/app/message-location/schema/MessageLocationQuerySchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { MessageLocationSchema } from "../schema/MessageLocationSchema";

export namespace messageLocationFetchFx {
	export type Props = MessageLocationQuerySchema.Type;
}

export const messageLocationFetchFx = (query: messageLocationFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withMessageLocationSelect({
					database,
					sort,
				}),
				output: MessageLocationSchema,
				filter,
				where,
				query: withMessageLocationQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "message-location",
				resourceId: "(query)",
				message: "Message location not found",
			});
		}

		return data;
	});
};

export type messageLocationFetchFx = ReturnType<typeof messageLocationFetchFx>;
