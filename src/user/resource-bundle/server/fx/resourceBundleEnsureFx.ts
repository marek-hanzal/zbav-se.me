import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace resourceBundleEnsureFx {
	export interface Props {
		userId: string;
	}
}

/**
 * This Fx ensures user has it's own bundle where we can assigne e.g. items or limits outside of the plan.
 */
export const resourceBundleEnsureFx = Effect.fn("resourceBundleEnsureFx")(function* ({
	userId,
}: resourceBundleEnsureFx.Props) {
	const logger = yield* getLoggerFx("resourceBundleEnsureFx");
	logger.trace("resourceBundleEnsureFx", {
		userId,
	});

	const dateService = yield* DateServiceFx;
	const now = dateService.now().toJSDate();

	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("resource_bundle")
					.values({
						id: userId,
						name: userId,
						type: "user",
						access: "protected",
						sort: 0,
					})
					.onConflict((oc) => {
						return oc.column("id").doNothing();
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

			return yield* dbFx(async (kysely) => {
				return kysely
					.selectFrom("user_resource_bundle as assignment")
					.innerJoin(
						"resource_bundle as bundle",
						"bundle.id",
						"assignment.resourceBundleId",
					)
					.select([
						"assignment.id",
						"assignment.expiresAt",
						"bundle.name as resourceBundleName",
						"bundle.type as resourceBundleType",
					])
					.where("assignment.userId", "=", userId)
					.where("assignment.resourceBundleId", "=", userId)
					.executeTakeFirstOrThrow();
			});
		}),
	);
});

export type resourceBundleEnsureFx = ReturnType<typeof resourceBundleEnsureFx>;
