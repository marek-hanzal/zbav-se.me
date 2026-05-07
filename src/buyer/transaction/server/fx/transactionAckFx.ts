import { Effect } from "effect";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";

export namespace transactionAckFx {
	export interface Props {
		listingId: string;
		transactionId: string;
		userId: string;
	}
}

export const transactionAckFx = Effect.fn("transactionAckFx")(function* ({
	listingId,
	transactionId,
	userId,
}: transactionAckFx.Props) {
	return yield* activityArchiveFx({
		where: {
			archivedAtIsNull: true,
			family: "transaction",
			type: "seller-message",
			referenceAllIn: [
				transactionId,
				listingId,
			],
		},
		scope: {
			userId,
		},
	});
});

export type transactionAckFx = ReturnType<typeof transactionAckFx>;
