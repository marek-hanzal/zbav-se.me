import { Effect } from "effect";
import { userEventCollectionFx } from "~/@user/user-event/fx/userEventCollectionFx";
import type { UserEventBuyerSchema } from "~/@user/user-event/schema/UserEventBuyerSchema";

export namespace userEventBuyerInfoFx {
	export interface Props {
		userId: string;
	}
}

export const userEventBuyerInfoFx = ({ userId }: userEventBuyerInfoFx.Props) => {
	return Effect.gen(function* () {
		const { data: source } = yield* userEventCollectionFx({
			cursor: {
				page: 0,
				size: 1000,
			},
			where: {
				cutoff: 90,
				userId,
			},
		});

		for (const event of source) {
			//
		}

		return {
			reaction: {
				total: 0,
				reactions: 0,
				medianMs: 0,
				p90Ms: 0,
			},
		} satisfies UserEventBuyerSchema.Type;
	});
};
