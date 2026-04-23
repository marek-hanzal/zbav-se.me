import { Effect } from "effect";
import type { ActivityTypeEnumSchema } from "~/common/activity/enum/ActivityTypeEnumSchema";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";

export namespace transactionMessageActivityArchiveFx {
	export interface Props {
		listingId: string;
		transactionId: string;
		type: Extract<ActivityTypeEnumSchema.Type, "buyer-message" | "seller-message">;
		userId: string;
	}
}

export const transactionMessageActivityArchiveFx = Effect.fn("transactionMessageActivityArchiveFx")(
	function* ({
		listingId,
		transactionId,
		type,
		userId,
	}: transactionMessageActivityArchiveFx.Props) {
		return yield* activityArchiveFx({
			where: {
				archivedAtIsNull: true,
				family: "transaction",
				type,
				referenceAllIn: [
					transactionId,
					listingId,
				],
			},
			scope: {
				userId,
			},
		});
	},
);

export type transactionMessageActivityArchiveFx = ReturnType<
	typeof transactionMessageActivityArchiveFx
>;
