import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace userBundleSnapshotExistsFx {
	export interface Props {
		assignmentId: string;
	}
}

/** Checks whether a user bundle already owns any concrete resource rows. */
export const userBundleSnapshotExistsFx = Effect.fn("userBundleSnapshotExistsFx")(function* ({
	assignmentId,
}: userBundleSnapshotExistsFx.Props) {
	const logger = yield* getLoggerFx("userBundleSnapshotExistsFx");
	logger.trace("userBundleSnapshotExistsFx", {
		assignmentId,
	});

	return yield* dbFx(async (kysely) => {
		const [item, limit, feature] = await Promise.all([
			kysely
				.selectFrom("user_resource_bundle_item")
				.select([
					"id",
				])
				.where("userResourceBundleId", "=", assignmentId)
				.executeTakeFirst(),
			kysely
				.selectFrom("user_resource_bundle_limit")
				.select([
					"id",
				])
				.where("userResourceBundleId", "=", assignmentId)
				.executeTakeFirst(),
			kysely
				.selectFrom("user_resource_bundle_feature")
				.select([
					"id",
				])
				.where("userResourceBundleId", "=", assignmentId)
				.executeTakeFirst(),
		]);

		return Boolean(item || limit || feature);
	});
});

export type userBundleSnapshotExistsFx = ReturnType<typeof userBundleSnapshotExistsFx>;
