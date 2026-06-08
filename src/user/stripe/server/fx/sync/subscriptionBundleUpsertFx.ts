import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace subscriptionBundleUpsertFx {
	export interface Props {
		userId: string;
		bundleId: string;
		subscriptionId: string;
		createdAt: Date;
		availableAt: Date;
		expiresAt: Date | null;
	}
}

/** Upserts one subscription-owned user bundle and its Stripe subscription mapping. */
export const subscriptionBundleUpsertFx = Effect.fn("subscriptionBundleUpsertFx")(function* ({
	userId,
	bundleId,
	subscriptionId,
	createdAt,
	availableAt,
	expiresAt,
}: subscriptionBundleUpsertFx.Props) {
	const logger = yield* getLoggerFx("subscriptionBundleUpsertFx");
	logger.trace("subscriptionBundleUpsertFx", {
		userId,
		bundleId,
		subscriptionId,
		expiresAt,
	});

	const assignment = yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("user_resource_bundle")
			.values({
				id: genId(),
				userId,
				resourceBundleId: bundleId,
				createdAt,
				availableAt,
				expiresAt,
			})
			.onConflict((oc) => {
				return oc
					.columns([
						"userId",
						"resourceBundleId",
					])
					.doUpdateSet({
						availableAt,
						expiresAt,
					});
			})
			.returning([
				"id",
			])
			.executeTakeFirstOrThrow();
	});

	yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("user_resource_bundle_stripe")
			.values({
				id: genId(),
				userResourceBundleId: assignment.id,
				subscriptionId: subscriptionId,
				createdAt,
			})
			.onConflict((oc) => {
				return oc.column("userResourceBundleId").doUpdateSet({
					subscriptionId: subscriptionId,
				});
			})
			.execute();
	});

	return assignment;
});

export type subscriptionBundleUpsertFx = ReturnType<typeof subscriptionBundleUpsertFx>;
