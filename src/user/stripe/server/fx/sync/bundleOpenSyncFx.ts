import { Effect } from "effect";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { userBundleFeatureCopyFx } from "~/user/resource-bundle/server/fx/userBundleFeatureCopyFx";
import { userBundleItemCopyFx } from "~/user/resource-bundle/server/fx/userBundleItemCopyFx";
import { userBundleLimitCopyFx } from "~/user/resource-bundle/server/fx/userBundleLimitCopyFx";
import { SyncSkipErrorFx } from "../../error/SyncSkipErrorFx";
import { bundleKeyLockFx } from "./bundleKeyLockFx";
import { bundlePurchaseAssignFx } from "./bundlePurchaseAssignFx";
import { bundlePurchaseExistsFx } from "./bundlePurchaseExistsFx";

export namespace bundleOpenSyncFx {
	export interface Props {
		userId: string;
		/** Source application bundle ID copied into Stripe metadata by checkout. */
		bundleId: string;
		/** Source application bundle name copied into Stripe metadata by checkout. */
		bundle: string;
		/** Deterministic readable key stored in Stripe metadata. */
		key: string;
		/** Stripe creation timestamp for the purchase source. */
		createdAt: Date;
	}
}

/** Opens one Stripe one-off purchase as a dedicated user resource bundle. */
export const bundleOpenSyncFx = Effect.fn("bundleOpenSyncFx")(function* ({
	userId,
	bundleId,
	bundle,
	key,
	createdAt,
}: bundleOpenSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleOpenSyncFx");
	logger.trace("bundleOpenSyncFx", {
		userId,
		bundleId,
		bundle,
		key,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* bundleKeyLockFx({
				key,
			});

			if (
				yield* bundlePurchaseExistsFx({
					key,
				})
			) {
				return yield* new SyncSkipErrorFx({
					message: "Stripe one-off purchase was already fulfilled",
					reason: "one-off already fulfilled",
					cause: {
						key,
					},
				});
			}

			const source = yield* dbFx(async (kysely) => {
				return kysely
					.selectFrom("resource_bundle")
					.select([
						"id",
					])
					.where("id", "=", bundleId)
					.executeTakeFirst();
			});

			if (!source) {
				return yield* new NotFoundErrorFx({
					resource: "resource_bundle",
					resourceId: bundleId,
					message: "Stripe source resource bundle is missing",
				});
			}

			const assignment = yield* bundlePurchaseAssignFx({
				userId,
				key,
				createdAt,
			});
			const copy = {
				bundleId: source.id,
				assignmentId: assignment.id,
				createdAt,
				availableAt: createdAt,
				stripeKey: key,
			} as const;

			return yield* Effect.all(
				[
					userBundleItemCopyFx(copy),
					userBundleLimitCopyFx(copy),
					userBundleFeatureCopyFx(copy),
				],
				{
					discard: true,
					concurrency: 3,
				},
			);
		}),
	);
});

export type bundleOpenSyncFx = ReturnType<typeof bundleOpenSyncFx>;
