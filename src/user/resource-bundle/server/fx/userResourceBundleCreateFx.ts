import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";
import type { UserResourceBundleCreateSchema } from "../schema/UserResourceBundleCreateSchema";
import { userBundleFeatureCopyFx } from "./userBundleFeatureCopyFx";
import { userBundleItemCopyFx } from "./userBundleItemCopyFx";
import { userBundleLimitCopyFx } from "./userBundleLimitCopyFx";

export namespace userResourceBundleCreateFx {
	export interface Props extends UserResourceBundleCreateSchema.Type {
		userId: string;
	}
}

export const userResourceBundleCreateFx = Effect.fn("userResourceBundleCreateFx")(function* ({
	userId,
	bundle: bundleName,
	availableAt,
	expiresAt = null,
}: userResourceBundleCreateFx.Props) {
	const logger = yield* getLoggerFx("userResourceBundleCreateFx");
	logger.trace("userResourceBundleCreateFx", {
		userId,
		bundle: bundleName,
		availableAt,
		expiresAt,
	});

	const dateService = yield* DateServiceFx;
	const now = dateService.now().toJSDate();
	const activeAt = availableAt ?? now;

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const bundle = yield* dbFx(async (kysely) => {
				return kysely
					.selectFrom("resource_bundle")
					.select([
						"id",
					])
					.where("name", "=", bundleName)
					.executeTakeFirst();
			});

			if (!bundle) {
				return yield* new InvalidRequestErrorFx({
					message: `Resource bundle [${bundleName}] does not exist`,
				});
			}

			const inserted = yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("user_resource_bundle")
					.values({
						id: genId(),
						userId,
						resourceBundleId: bundle.id,
						createdAt: now,
						availableAt: activeAt,
						expiresAt,
					})
					.onConflict((oc) =>
						oc
							.columns([
								"userId",
								"resourceBundleId",
							])
							.doNothing(),
					)
					.returning([
						"id",
					])
					.executeTakeFirst();
			});

			if (inserted) {
				const copy = {
					bundleId: bundle.id,
					assignmentId: inserted.id,
					createdAt: now,
					availableAt: activeAt,
				} as const;
				const childExpires =
					expiresAt === null
						? {}
						: {
								expiresAt,
							};

				yield* Effect.all(
					[
						userBundleItemCopyFx({
							...copy,
							...childExpires,
						}),
						userBundleLimitCopyFx({
							...copy,
							...childExpires,
						}),
						userBundleFeatureCopyFx({
							...copy,
							...childExpires,
						}),
					],
					{
						discard: true,
						concurrency: 3,
					},
				);
			}

			return yield* dbFx(async (kysely) => {
				return kysely
					.selectFrom("user_resource_bundle")
					.selectAll()
					.where("userId", "=", userId)
					.where("resourceBundleId", "=", bundle.id)
					.executeTakeFirstOrThrow();
			});
		}),
	);
});

export type userResourceBundleCreateFx = ReturnType<typeof userResourceBundleCreateFx>;
