import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { dbFx } from "~/server/database/fx/dbFx";
import type { BundleActiveSchema } from "../schema/BundleActiveSchema";

export namespace bundleActiveFx {
	export interface Props extends BundleActiveSchema.Type {
		userId: string;
	}
}

export const bundleActiveFx = Effect.fn("bundleActiveFx")(function* ({
	bundle: bundleName,
	userId,
}: bundleActiveFx.Props) {
	const dateService = yield* DateServiceFx;
	const now = dateService.now().toJSDate();

	return Boolean(
		yield* dbFx(async (kysely) => {
			return kysely
				.selectFrom("user_resource_bundle as assignment")
				.innerJoin("resource_bundle as bundle", "bundle.id", "assignment.resourceBundleId")
				.select([
					"assignment.id",
				])
				.where("assignment.userId", "=", userId)
				.where("bundle.name", "=", bundleName)
				.where("assignment.availableAt", "<=", now)
				.where((eb) =>
					eb.or([
						eb("assignment.expiresAt", "is", null),
						eb("assignment.expiresAt", ">", now),
					]),
				)
				.executeTakeFirst();
		}),
	);
});

export type bundleActiveFx = ReturnType<typeof bundleActiveFx>;
