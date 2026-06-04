import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

interface ResourceBundleEnsureResult {
	id: string;
	userId: string;
	resourceBundleId: string;
	resourceBundleName: string;
	expiresAt: Date | null;
}

export namespace resourceBundleEnsureFx {
	export interface Props {
		userId: string;
	}
}

export const resourceBundleEnsureFx = Effect.fn("resourceBundleEnsureFx")(function* ({
	userId,
}: resourceBundleEnsureFx.Props) {
	const logger = yield* getLoggerFx("resourceBundleEnsureFx");
	logger.trace("resourceBundleEnsureFx", {
		userId,
	});

	const dateContext = yield* DateContextFx;
	const now = dateContext.now().toJSDate();

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const insertedResourceBundle = yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("resource_bundle")
					.values({
						id: genId(),
						name: userId,
					})
					.onConflict((oc) => oc.column("name").doNothing())
					.returning([
						"id",
						"name",
					])
					.executeTakeFirst();
			});
			const resourceBundle =
				insertedResourceBundle ??
				(yield* dbFx(async (kysely) => {
					return kysely
						.selectFrom("resource_bundle")
						.select([
							"id",
							"name",
						])
						.where("name", "=", userId)
						.executeTakeFirstOrThrow();
				}));
			const userResourceBundle = yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("user_resource_bundle")
					.values({
						id: genId(),
						userId,
						resourceBundleId: resourceBundle.id,
						createdAt: now,
						availableAt: now,
						expiresAt: null,
					})
					.onConflict((oc) => {
						return oc
							.columns([
								"userId",
								"resourceBundleId",
							])
							.doUpdateSet({
								availableAt: now,
								expiresAt: null,
							});
					})
					.returning([
						"id",
						"userId",
						"resourceBundleId",
						"expiresAt",
					])
					.executeTakeFirstOrThrow();
			});

			const result: ResourceBundleEnsureResult = {
				id: userResourceBundle.id,
				userId: userResourceBundle.userId,
				resourceBundleId: userResourceBundle.resourceBundleId,
				resourceBundleName: resourceBundle.name,
				expiresAt: userResourceBundle.expiresAt,
			};

			return result;
		}),
	);
});

export type resourceBundleEnsureFx = ReturnType<typeof resourceBundleEnsureFx>;
