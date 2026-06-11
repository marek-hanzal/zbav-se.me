import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace bundlePurchaseAssignFx {
	export interface Props {
		userId: string;
		key: string;
		createdAt: Date;
	}
}

/** Creates/updates the local user bundle assignment that owns one Stripe purchase. */
export const bundlePurchaseAssignFx = Effect.fn("bundlePurchaseAssignFx")(function* ({
	userId,
	key,
	createdAt,
}: bundlePurchaseAssignFx.Props) {
	const logger = yield* getLoggerFx("bundlePurchaseAssignFx");
	logger.trace("bundlePurchaseAssignFx", {
		userId,
		key,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const purchase = yield* dbFx(async (kysely) => {
				const inserted = await kysely
					.insertInto("resource_bundle")
					.values({
						id: genId(),
						name: key,
						type: "extra",
					})
					.onConflict((oc) => oc.column("name").doNothing())
					.returning([
						"id",
					])
					.executeTakeFirst();

				if (inserted) {
					return inserted;
				}

				return kysely
					.selectFrom("resource_bundle")
					.select([
						"id",
					])
					.where("name", "=", key)
					.executeTakeFirstOrThrow();
			});

			return yield* dbFx(async (kysely) => {
				const inserted = await kysely
					.insertInto("user_resource_bundle")
					.values({
						id: genId(),
						userId,
						resourceBundleId: purchase.id,
						createdAt,
						availableAt: createdAt,
						expiresAt: null,
					})
					.onConflict((oc) => {
						return oc
							.columns([
								"userId",
								"resourceBundleId",
							])
							.doUpdateSet({
								availableAt: createdAt,
								expiresAt: null,
							});
					})
					.returning([
						"id",
					])
					.executeTakeFirst();

				if (inserted) {
					return inserted;
				}

				return kysely
					.selectFrom("user_resource_bundle")
					.select([
						"id",
					])
					.where("userId", "=", userId)
					.where("resourceBundleId", "=", purchase.id)
					.executeTakeFirstOrThrow();
			});
		}),
	);
});

export type bundlePurchaseAssignFx = ReturnType<typeof bundlePurchaseAssignFx>;
