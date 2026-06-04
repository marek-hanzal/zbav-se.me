import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace resourceBundleEnsureFx {
	export interface Props {
		userId: string;
	}
}

export const resourceBundleEnsureFx = Effect.fn("resourceBundleEnsureFx")(function* ({
	userId,
}: resourceBundleEnsureFx.Props) {
	const logger = yield* getLoggerFx("resourceBundleEnsureFx");
	logger.trace("resourceBundleEnsureFx", {
		userId,
	});

	const dateContext = yield* DateContextFx;
	const now = dateContext.now().toJSDate();

	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("resource_bundle")
					.values({
						id: userId,
						name: userId,
					})
					.onConflict((oc) => {
						return oc
							.columns([
								"id",
								"name",
							])
							.doNothing();
					})
					.execute();
			});

			yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("user_resource_bundle")
					.values({
						id: genId(),
						userId,
						resourceBundleId: userId,
						createdAt: now,
						availableAt: now,
						expiresAt: null,
					})
					.onConflict((oc) => {
						return oc
							.columns([
								"userId",
								"resourceBundleId",
							])
							.doNothing();
					})
					.execute();
			});
		}),
	);
});

export type resourceBundleEnsureFx = ReturnType<typeof resourceBundleEnsureFx>;
