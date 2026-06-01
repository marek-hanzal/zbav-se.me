import { Effect } from "effect";
import type { ResourceLimitCheckSchema } from "../schema/ResourceLimitCheckSchema";
import { resourceLimitFetchFx } from "./resourceLimitFetchFx";

export namespace resourceLimitCheckFx {
	export interface Props extends ResourceLimitCheckSchema.Type {
		userId: string;
	}
}

export const resourceLimitCheckFx = Effect.fn("resourceLimitCheckFx")(function* ({
	userId,
	count,
	resource,
}: resourceLimitCheckFx.Props) {
	const { limit } = yield* resourceLimitFetchFx({
		where: {
			resourceDefinitionId: resource,
		},
		scope: {
			userId,
		},
	}).pipe(
		Effect.catchTag("NotFoundErrorFx", () =>
			Effect.succeed({
				limit: 0,
			}),
		),
	);

	return {
		count,
		limit,
		remaining: Math.max(limit - count, 0),
		isAvailable: count < limit,
	};
});

export type resourceLimitCheckFx = ReturnType<typeof resourceLimitCheckFx>;
