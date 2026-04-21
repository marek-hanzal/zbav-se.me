import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { checkRestrictionFx } from "~/user/category/server/fx/checkRestrictionFx";

describe("checkRestrictionFx", () => {
	it("succeeds when request level equals required level", () =>
		checkRestrictionFx({
			level: "adult",
			request: "adult",
		}).pipe(Effect.map((result) => expect(result).toBeUndefined())));

	it("succeeds when request level exceeds required level", () =>
		checkRestrictionFx({
			level: "adult-relaxed",
			request: "adult",
		}).pipe(Effect.map((result) => expect(result).toBeUndefined())));

	it("succeeds when request level is the highest restriction", () =>
		checkRestrictionFx({
			level: "none",
			request: "restricted",
		}).pipe(Effect.map((result) => expect(result).toBeUndefined())));

	it("fails when request level is lower than required level", () =>
		checkRestrictionFx({
			level: "adult",
			request: "adult-relaxed",
		}).pipe(
			Effect.mapError((error) => {
				expect(error._tag).toBe("InvalidRequestErrorFx");
				expect(error.message).toContain("Cannot use lower restriction level");
			}),
		));

	it("fails when request is none and level is adult", () =>
		checkRestrictionFx({
			level: "adult",
			request: "none",
		}).pipe(
			Effect.mapError((error) => {
				expect(error._tag).toBe("InvalidRequestErrorFx");
			}),
		));

	it("fails when request is sensitive and level is restricted", () =>
		checkRestrictionFx({
			level: "restricted",
			request: "sensitive",
		}).pipe(
			Effect.mapError((error) => {
				expect(error._tag).toBe("InvalidRequestErrorFx");
			}),
		));
});
