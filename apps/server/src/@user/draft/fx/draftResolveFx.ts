import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { AccessDeniedError } from "~/error/AccessDeniedError";
import { NotFoundError } from "~/error/NotFoundError";

export namespace draftResolveFx {
	export interface Props {
		draftId: string;
		message?: string;
	}
}

export const draftResolveFx = ({
	draftId,
	message = "You are not allowed to access this draft",
}: draftResolveFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const draft = yield* Effect.tryPromise(async () => {
			return database
				.selectFrom("draft")
				.selectAll()
				.where("id", "=", draftId)
				.executeTakeFirst();
		});

		if (!draft) {
			return yield* new NotFoundError({
				resource: "draft",
				resourceId: draftId,
				message,
			});
		}

		if (draft.userId !== user.id) {
			return yield* new AccessDeniedError({
				message,
			});
		}

		return draft;
	});
};

export type draftResolveFx = ReturnType<typeof draftResolveFx>;
