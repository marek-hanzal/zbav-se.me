import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { inboxFetchFx } from "~/@user/inbox/server/fx/inboxFetchFx";
import type { InboxCreateSchema } from "~/@user/inbox/server/schema/InboxCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace inboxCreateFx {
	export type Props = InboxCreateSchema.Type;
}

export const inboxCreateFx = Effect.fn("inboxCreateFx")(function* ({
	userId,
	reference,
	family,
	type,
	payload,
	priority,
}: inboxCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;
			const id = genId();

			yield* tryDbFx(async () =>
				kysely
					.insertInto("inbox")
					.values({
						id,
						userId,
						reference: reference ?? [],
						family,
						type,
						payload,
						priority,
						timestamp: dateContext.now().toJSDate(),
						archivedAt: null,
					})
					.returningAll()
					.executeTakeFirstOrThrow(),
			);

			return yield* inboxFetchFx({
				where: {
					id,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type inboxCreateFx = ReturnType<typeof inboxCreateFx>;
