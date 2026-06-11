import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace userBundleEntitlementsExpireFx {
	export interface Props {
		assignmentId: string;
		expiresAt: Date | null;
	}
}

/** Updates time-bound limit/feature grants for one user bundle. */
export const userBundleEntitlementsExpireFx = Effect.fn("userBundleEntitlementsExpireFx")(
	function* ({ assignmentId, expiresAt }: userBundleEntitlementsExpireFx.Props) {
		const logger = yield* getLoggerFx("userBundleEntitlementsExpireFx");
		logger.trace("userBundleEntitlementsExpireFx", {
			assignmentId,
			expiresAt,
		});

		yield* withTransactionFx(
			dbFx(async (kysely) => {
				await kysely
					.updateTable("user_resource_bundle_limit")
					.set({
						expiresAt,
					})
					.where("userResourceBundleId", "=", assignmentId)
					.execute();

				await kysely
					.updateTable("user_resource_bundle_feature")
					.set({
						expiresAt,
					})
					.where("userResourceBundleId", "=", assignmentId)
					.execute();
			}),
		);
	},
);

export type userBundleEntitlementsExpireFx = ReturnType<typeof userBundleEntitlementsExpireFx>;
