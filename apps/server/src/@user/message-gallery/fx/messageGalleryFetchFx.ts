import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageGalleryQueryBuilder } from "~/app/message-gallery/db/withMessageGalleryQueryBuilder";
import { withMessageGallerySelect } from "~/app/message-gallery/db/withMessageGallerySelect";
import type { MessageGalleryQuerySchema } from "~/app/message-gallery/schema/MessageGalleryQuerySchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { MessageGallerySchema } from "../schema/MessageGallerySchema";

export namespace messageGalleryFetchFx {
	export interface Props {
		query: Omit<MessageGalleryQuerySchema.Type, "cursor">;
	}
}

export const messageGalleryFetchFx = ({ query }: messageGalleryFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withMessageGallerySelect({
					database,
					sort,
				}),
				output: MessageGallerySchema,
				filter,
				where,
				query: withMessageGalleryQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "message-gallery",
				resourceId: "(query)",
				message: "Message gallery not found",
			});
		}

		return data;
	});
};

export type messageGalleryFetchFx = ReturnType<typeof messageGalleryFetchFx>;
