import { Effect } from "effect";
import { ResourceLimitErrorFx } from "~/user-resource-limit/error/ResourceLimitErrorFx";
import { resourceLimitCheckFx } from "~/user-resource-limit/fx/resourceLimitCheckFx";
import type { ResourceLimitCheckSchema } from "~/user-resource-limit/schema/ResourceLimitCheckSchema";

export namespace resourceLimitEnsureFx {
	export interface Props extends ResourceLimitCheckSchema.Type {
		userId: string;
	}
}

export const resourceLimitEnsureFx = Effect.fn("resourceLimitEnsureFx")(function* ({
	count,
	resource,
	userId,
}: resourceLimitEnsureFx.Props) {
	const result = yield* resourceLimitCheckFx({
		count,
		resource,
		userId,
	});

	if (!result.isAvailable) {
		return yield* new ResourceLimitErrorFx({
			message: `Resource limit exceeded for [${resource}]`,
		});
	}

	return result;
});

export type resourceLimitEnsureFx = ReturnType<typeof resourceLimitEnsureFx>;
