import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { AccessDeniedError } from "~/error/AccessDeniedError";
import { NotFoundError } from "~/error/NotFoundError";

export namespace feedResolveFx {
	export interface Props {
		feedId: string;
		message?: string;
	}
}

export const feedResolveFx = ({
	feedId,
	message = "You are not allowed to access this feed",
}: feedResolveFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const feed = yield* Effect.tryPromise(async () => {
			return database
				.selectFrom("feed")
				.selectAll()
				.where("id", "=", feedId)
				.executeTakeFirst();
		});

		if (!feed) {
			return yield* new NotFoundError({
				resource: "feed",
				resourceId: feedId,
				message,
			});
		}

		if (feed.userId !== user.id) {
			return yield* new AccessDeniedError({
				message,
			});
		}

		return feed;
	});
};

export type feedResolveFx = ReturnType<typeof feedResolveFx>;
