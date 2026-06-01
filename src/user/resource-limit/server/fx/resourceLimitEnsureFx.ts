import { Effect } from "effect";
import { ResourceLimitErrorFx } from "../error/ResourceLimitErrorFx";
import type { ResourceLimitCheckSchema } from "../schema/ResourceLimitCheckSchema";
import { resourceLimitCheckFx } from "./resourceLimitCheckFx";

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
