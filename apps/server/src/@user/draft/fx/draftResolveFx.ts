import { NotFoundErrorFx } from "@use-pico/common/error";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { AccessDeniedError } from "~/error/AccessDeniedError";

export namespace draftResolveFx {
	export interface Props {
		draftId: string;
		message?: string;
	}
}

export const draftResolveFx = Effect.fn("draftResolveFx")(function* ({
	draftId,
	message = "You are not allowed to access this draft",
}: draftResolveFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	const draft = yield* Effect.promise(async () => {
		return database
			.selectFrom("draft")
			.selectAll()
			.where("id", "=", draftId)
			.executeTakeFirst();
	});

	if (!draft) {
		return yield* new NotFoundErrorFx({
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

export type draftResolveFx = ReturnType<typeof draftResolveFx>;
