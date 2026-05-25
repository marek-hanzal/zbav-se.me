import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export const withExpireAtCronFx = Effect.fn("withExpireAtCronFx")(function* () {
	yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateContextFx;

			yield* dbFx(async (kysely) => {
				const source = kysely
					.selectFrom("listing as l")
					.select("l.id")
					.where("l.status", "=", "live")
					.where("l.expiresAt", "<=", dateContext.now().toJSDate())
					.limit(50_000);

				return kysely
					.updateTable("listing")
					.set({
						status: "expired",
					})
					.where("id", "in", source);
			});
		}),
	);
});

export type withExpireAtCronFx = ReturnType<typeof withExpireAtCronFx>;
