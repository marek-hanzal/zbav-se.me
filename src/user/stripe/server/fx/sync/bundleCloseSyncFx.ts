import { Effect } from "effect";
import { NotFoundErrorFx } from "@/lib/common/error";
import { getLoggerFx } from "@/lib/common/log";
import { userBundleResourcesExpireFx } from "~/user/resource-bundle/server/fx/userBundleResourcesExpireFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { bundleCloseCollectionFx } from "./bundleCloseCollectionFx";
import { bundleKeyLockFx } from "./bundleKeyLockFx";

export namespace bundleCloseSyncFx {
	export interface Props {
		/** Deterministic Stripe bundle key used by the grant sync. */
		key: string;
		/** Stripe event timestamp that invalidated the purchase. */
		expiresAt: Date;
	}
}

/** Expires every local resource created by one Stripe one-off purchase. */
export const bundleCloseSyncFx = Effect.fn("bundleCloseSyncFx")(function* ({
	key,
	expiresAt,
}: bundleCloseSyncFx.Props) {
	const logger = yield* getLoggerFx("bundleCloseSyncFx");
	logger.trace("bundleCloseSyncFx", {
		key,
		expiresAt,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* bundleKeyLockFx({
				key,
			});

			const assignmentIds = yield* bundleCloseCollectionFx({
				key,
			});

			if (assignmentIds.length === 0) {
				return yield* new NotFoundErrorFx({
					resource: "stripe-one-off-purchase-bundle",
					resourceId: key,
					message: "Stripe one-off purchase bundle is missing",
				});
			}

			return yield* userBundleResourcesExpireFx({
				assignmentIds,
				expiresAt,
			});
		}),
	);
});

export type bundleCloseSyncFx = ReturnType<typeof bundleCloseSyncFx>;
