import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace userBundleResourcesExpireFx {
	export interface Props {
		assignmentIds: string[];
		expiresAt: Date;
	}
}

/** Hard-expires a set of user bundles and every concrete resource row under them. */
export const userBundleResourcesExpireFx = Effect.fn("userBundleResourcesExpireFx")(function* ({
	assignmentIds,
	expiresAt,
}: userBundleResourcesExpireFx.Props) {
	const logger = yield* getLoggerFx("userBundleResourcesExpireFx");
	logger.trace("userBundleResourcesExpireFx", {
		assignmentIds,
		expiresAt,
	});

	if (assignmentIds.length === 0) {
		return yield* Effect.void;
	}

	yield* withTransactionFx(
		dbFx(async (kysely) => {
			await kysely
				.updateTable("user_resource_bundle")
				.set({
					expiresAt,
				})
				.where("id", "in", assignmentIds)
				.execute();

			await kysely
				.updateTable("user_resource_bundle_item")
				.set({
					expiresAt,
				})
				.where("userResourceBundleId", "in", assignmentIds)
				.execute();

			await kysely
				.updateTable("user_resource_bundle_limit")
				.set({
					expiresAt,
				})
				.where("userResourceBundleId", "in", assignmentIds)
				.execute();

			await kysely
				.updateTable("user_resource_bundle_feature")
				.set({
					expiresAt,
				})
				.where("userResourceBundleId", "in", assignmentIds)
				.execute();
		}),
	);
});

export type userBundleResourcesExpireFx = ReturnType<typeof userBundleResourcesExpireFx>;
