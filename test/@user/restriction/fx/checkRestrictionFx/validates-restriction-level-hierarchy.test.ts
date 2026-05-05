import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { checkRestrictionFx } from "~/user/restriction/server/fx/checkRestrictionFx";

const restrictionLevels = [
	"none",
	"adult-relaxed",
	"adult",
	"sensitive",
	"restricted",
] as const satisfies RestrictionEnumSchema.Type[];

describe("checkRestrictionFx", () => {
	it("accepts only equal or stronger requested restriction levels across the whole matrix", async () => {
		for (const [levelIndex, level] of restrictionLevels.entries()) {
			for (const [requestIndex, request] of restrictionLevels.entries()) {
				const result = await Effect.either(
					checkRestrictionFx({
						level,
						request,
					}),
				).pipe(Effect.runPromise);

				if (requestIndex >= levelIndex) {
					expect(result._tag).toBe("Right");
				} else {
					expect(result._tag).toBe("Left");

					if (result._tag === "Left") {
						expect(result.left._tag).toBe("InvalidRequestErrorFx");
						expect(result.left.message).toContain(
							`Cannot use lower restriction level [${request}] than [${level}]`,
						);
					}
				}
			}
		}
	});
});
