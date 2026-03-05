import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { inboxFetchFx } from "~/@user/inbox/fx/inboxFetchFx";
import type { InboxCreateSchema } from "~/@user/inbox/schema/InboxCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { traceLogFx } from "~/effect/traceLogFx";

export namespace inboxCreateFx {
	export interface Props extends InboxCreateSchema.Type {
		//
	}
}

export const inboxCreateFx = Effect.fn("inboxCreateFx")(function* ({
	userId,
	type,
	payload,
	priority,
}: inboxCreateFx.Props) {
	yield* traceLogFx({
		level: "trace",
		message: "inboxCreateFx",
		input: {
			userId,
			type,
			priority,
			payload,
		},
	});

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
