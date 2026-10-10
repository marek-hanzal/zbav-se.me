import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { NotFoundErrorFx } from "~/error/error/NotFoundErrorFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace draftCheckIfOwnFx {
	export interface Props {
		userId: string;
		draftId: string;
	}
}

export const draftCheckIfOwnFx = Effect.fn("draftCheckIfOwnFx")(function* ({
	userId,
	draftId,
}: draftCheckIfOwnFx.Props) {
	const logger = yield* getLoggerFx("draftCheckIfOwnFx");
	logger.trace("draftCheckIfOwnFx", {
		userId,
		draftId,
	});

	const draft = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("draft")
			.select("userId")
			.where("id", "=", draftId)
			.where("userId", "=", userId)
			.executeTakeFirst();
	});

	if (!draft) {
		return yield* new NotFoundErrorFx({
			resource: "draft",
			resourceId: draftId,
			message: "Draft not found",
		});
	}

	return draft.userId;
});

export type draftCheckIfOwnFx = ReturnType<typeof draftCheckIfOwnFx>;
