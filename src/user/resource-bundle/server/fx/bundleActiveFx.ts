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
	bundle,
	userId,
}: bundleActiveFx.Props) {
	const dateService = yield* DateServiceFx;
	const now = dateService.now().toJSDate();

	return Boolean(
		yield* dbFx(async (kysely) => {
			return kysely
				.selectFrom("user_resource_bundle as urb")
				.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
				.select([
					"urb.id",
				])
				.where("urb.userId", "=", userId)
				.where("rb.name", "=", bundle)
				.where("urb.availableAt", "<=", now)
				.where((eb) =>
					eb.or([
						eb("urb.expiresAt", "is", null),
						eb("urb.expiresAt", ">", now),
					]),
				)
				.executeTakeFirst();
		}),
	);
});

export type bundleActiveFx = ReturnType<typeof bundleActiveFx>;
