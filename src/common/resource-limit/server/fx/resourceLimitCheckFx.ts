import { Effect } from "effect";
import type { ResourceLimitCheckSchema } from "../schema/ResourceLimitCheckSchema";
import type { ResourceLimitInfoSchema } from "../schema/ResourceLimitInfoSchema";
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
	const data = yield* resourceLimitFetchFx({
		where: {
			resourceDefinitionId: resource,
		},
		scope: {
			userId,
		},
	}).pipe(Effect.catchTag("NotFoundErrorFx", () => Effect.succeed(undefined)));

	return (
		data
			? {
					count,
					limit: data.limit,
					remaining: Math.max(data.limit - count, 0),
					isAvailable: count < data.limit,
				}
			: {
					count,
					limit: 0,
					remaining: 0,
					isAvailable: false,
				}
	) satisfies ResourceLimitInfoSchema.Type;
});

export type resourceLimitCheckFx = ReturnType<typeof resourceLimitCheckFx>;
