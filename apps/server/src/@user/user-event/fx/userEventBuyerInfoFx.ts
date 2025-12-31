import { Effect } from "effect";
import { userEventCollectionFx } from "~/@user/user-event/fx/userEventCollectionFx";

export namespace userEventBuyerInfoFx {
	export interface Props {
		userId: string;
	}
}

export const userEventBuyerInfoFx = ({ userId }: userEventBuyerInfoFx.Props) => {
	return Effect.gen(function* () {
		const source = yield* userEventCollectionFx({
			cursor: {
				page: 0,
				size: 1000,
			},
			where: {
				cutoff: 90,
				userId,
			},
		});
	});
};
