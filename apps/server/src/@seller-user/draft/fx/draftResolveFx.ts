import { NotFoundErrorFx } from "@use-pico/common/error";
import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { AccessDeniedErrorFx } from "~/error/AccessDeniedErrorFx";

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

	const draft = yield* Effect.promise(async () => {
		return kysely.selectFrom("draft").selectAll().where("id", "=", draftId).executeTakeFirst();
	});

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
