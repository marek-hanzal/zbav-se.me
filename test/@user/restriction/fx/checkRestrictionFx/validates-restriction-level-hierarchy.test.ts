import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import type { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";
import { checkRestrictionFx } from "~/user-restriction/fx/checkRestrictionFx";

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
				const result = await Effect.result(
					checkRestrictionFx({
						level,
						request,
					}),
				).pipe(Effect.runPromise);

				if (requestIndex >= levelIndex) {
					expect(result._tag).toBe("Success");
				} else {
					expect(result._tag).toBe("Failure");

					if (result._tag === "Failure") {
						expect(result.failure._tag).toBe("InvalidRequestErrorFx");
						expect(result.failure.message).toContain(
							`Cannot use lower restriction level [${request}] than [${level}]`,
						);
					}
				}
			}
		}
	});
});
