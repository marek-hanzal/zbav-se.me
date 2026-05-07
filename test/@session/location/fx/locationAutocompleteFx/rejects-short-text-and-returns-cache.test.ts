import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("locationAutocompleteFx", () => {
	it("rejects short input and returns persisted cached locations", async () => {
		const database = await testabase("locationAutocompleteFx-cache");

		return Effect.gen(function* () {
			const shortText = yield* Effect.either(
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

			expectTaggedErrorFx(shortText, {
				tag: "TextTooShortErrorFx",
			});
			expect(cached).toHaveLength(1);
			expect(cached[0]?.id).toBe("loc_test_praha");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
