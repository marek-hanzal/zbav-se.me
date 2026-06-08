import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";
import type { UserResourceBundleCreateSchema } from "../schema/UserResourceBundleCreateSchema";
import { userResourceBundleMaterializeFx } from "./userResourceBundleMaterializeFx";

export namespace userResourceBundleCreateFx {
	export interface Props extends UserResourceBundleCreateSchema.Type {
		userId: string;
	}
}

export const userResourceBundleCreateFx = Effect.fn("userResourceBundleCreateFx")(function* ({
	userId,
	bundle,
	availableAt,
	expiresAt = null,
}: userResourceBundleCreateFx.Props) {
	const logger = yield* getLoggerFx("userResourceBundleCreateFx");
	logger.trace("userResourceBundleCreateFx", {
		userId,
		bundle,
		availableAt,
		expiresAt,
	});

	const dateService = yield* DateServiceFx;
	const now = dateService.now().toJSDate();
	const activeFrom = availableAt ?? now;

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const resourceBundle = yield* dbFx(async (kysely) => {
				return kysely
					.selectFrom("resource_bundle")
					.select([
						"id",
					])
					.where("name", "=", bundle)
					.executeTakeFirst();
			});

			if (!resourceBundle) {
				return yield* new InvalidRequestErrorFx({
					message: `Resource bundle [${bundle}] does not exist`,
				});
			}

			const inserted = yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("user_resource_bundle")
					.values({
						id: genId(),
						userId,
						resourceBundleId: resourceBundle.id,
						createdAt: now,
						availableAt: activeFrom,
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
				yield* userResourceBundleMaterializeFx({
					resourceBundleId: resourceBundle.id,
					userResourceBundleId: inserted.id,
					createdAt: now,
					availableAt: activeFrom,
					...(expiresAt === null
						? {}
						: {
								featureExpiresAt: expiresAt,
								itemExpiresAt: expiresAt,
								limitExpiresAt: expiresAt,
							}),
				});
			}

			return yield* dbFx(async (kysely) => {
				return kysely
					.selectFrom("user_resource_bundle")
					.selectAll()
					.where("userId", "=", userId)
					.where("resourceBundleId", "=", resourceBundle.id)
					.executeTakeFirstOrThrow();
			});
		}),
	);
});

export type userResourceBundleCreateFx = ReturnType<typeof userResourceBundleCreateFx>;
