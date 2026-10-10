import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genId } from "~/identity/fn/genId";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { InvalidRequestErrorFx } from "~/server-error/error/InvalidRequestErrorFx";
import { userBundleFeatureCopyFx } from "~/user-resource-bundle/fx/userBundleFeatureCopyFx";
import { userBundleItemCopyFx } from "~/user-resource-bundle/fx/userBundleItemCopyFx";
import { userBundleLimitCopyFx } from "~/user-resource-bundle/fx/userBundleLimitCopyFx";
import type { UserResourceBundleCreateSchema } from "~/user-resource-bundle/schema/UserResourceBundleCreateSchema";

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
