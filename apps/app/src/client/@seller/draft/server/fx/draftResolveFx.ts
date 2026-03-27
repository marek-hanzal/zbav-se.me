import { NotFoundErrorFx } from "@use-pico/common/error";
import { Effect } from "effect";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { AccessDeniedErrorFx } from "~/server/error/AccessDeniedErrorFx";

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
	const { kysely } = yield* KyselyContextFx;

	const draft = yield* tryDbFx(async () =>
		kysely.selectFrom("draft").selectAll().where("id", "=", draftId).executeTakeFirst(),
	);

	if (!draft) {
		return yield* new NotFoundErrorFx({
			resource: "draft",
			resourceId: draftId,
			message,
		});
	}

	if (draft.userId !== userId) {
		return yield* new AccessDeniedErrorFx({
			message,
		});
	}

	return draft;
});

export type draftResolveFx = ReturnType<typeof draftResolveFx>;
