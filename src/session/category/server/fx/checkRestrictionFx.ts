import { Effect } from "effect";
import type { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";

const levels = {
	none: 0,
	"adult-relaxed": 1,
	adult: 2,
	sensitive: 3,
	restricted: 4,
} satisfies Record<CategoryRestrictionEnumSchema.Type, number>;

export namespace checkRestrictionFx {
	export interface Props {
		level: CategoryRestrictionEnumSchema.Type;
		request: CategoryRestrictionEnumSchema.Type;
	}
}

export const checkRestrictionFx = Effect.fn("checkRestrictionFx")(function* ({
	level,
	request,
}: checkRestrictionFx.Props) {
	if (levels[request] < levels[level]) {
		return yield* new InvalidRequestErrorFx({
			message: `Cannot use lower restriction level [${request}] than [${level}]`,
		});
	}
});

export type checkRestrictionFx = ReturnType<typeof checkRestrictionFx>;
