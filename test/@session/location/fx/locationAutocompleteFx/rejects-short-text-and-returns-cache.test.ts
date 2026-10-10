import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { locationAutocompleteFx } from "~/session-location/fx/locationAutocompleteFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

describe("locationAutocompleteFx", () => {
	it("rejects short input and returns persisted cached locations", async () => {
		const database = await testabaseFn("locationAutocompleteFx-cache");

		return Effect.gen(function* () {
			const shortText = yield* Effect.result(
				locationAutocompleteFx({
					text: "Pr",
					lang: "cs",
					limit: 1,
				}),
			);
			const cached = yield* locationAutocompleteFx({
				text: "Praha",
				lang: "cs",
				limit: 1,
			});

			expectTaggedErrorFn(shortText, {
				tag: "TextTooShortErrorFx",
			});
			expect(cached).toHaveLength(1);
			expect(cached[0]?.id).toBe("loc_test_praha");
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
