import { NotFoundErrorFx } from "@use-pico/common/error";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { AccessDeniedError } from "~/error/AccessDeniedError";

export namespace draftResolveFx {
	export interface Props {
		userId: string;
		draftId: string;
		message?: string;
	}
}

export const draftResolveFx = Effect.fn("draftResolveFx")(function* ({
	userId,
	draftId,
	message = "You are not allowed to access this draft",
}: draftResolveFx.Props) {
	const database = yield* DatabaseContextFx;

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

	if (draft.userId !== userId) {
		return yield* new AccessDeniedError({
			message,
		});
	}

	return draft;
});

export type draftResolveFx = ReturnType<typeof draftResolveFx>;

