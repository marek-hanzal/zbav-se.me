import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFx } from "@/lib/common/date";
import { rateLimitEventFx } from "~/server/rate-limit/server/fx/rateLimitEventFx";
import { rateLimitFx } from "~/server/rate-limit/server/fx/rateLimitFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("rateLimitFx", () => {
	it("returns current window snapshot without incrementing count", async () => {
		const database = await testabase("rateLimitFx-current-window-snapshot");
		const fixedNow = DateTime.fromISO("2026-05-11T10:05:45.000Z");

		return Effect.gen(function* () {
			yield* Effect.promise(() =>
				database.kysely
					.insertInto("rate_limit_rule")
					.values({
						name: "listing:snapshot",
						window: 60,
						limit: 3,
					})
					.execute(),
			);

			const before = yield* rateLimitFx({
				rule: "listing:snapshot",
				key: [
					"user:1",
				],
			}).pipe(
				withDateServiceFx({
					now: () => fixedNow,
				}),
			);

			yield* rateLimitEventFx({
				rule: "listing:snapshot",
				key: [
					"user:1",
				],
			}).pipe(
				withDateServiceFx({
					now: () => fixedNow,
				}),
			);

			const after = yield* rateLimitFx({
				rule: "listing:snapshot",
				key: [
					"user:1",
				],
			}).pipe(
				withDateServiceFx({
					now: () => fixedNow,
				}),
			);

			expect(before).toMatchObject({
				rule: "listing:snapshot",
				count: 0,
				limit: 3,
				seconds: 60,
			});
			expect(after).toMatchObject({
				rule: "listing:snapshot",
				count: 1,
				limit: 3,
				seconds: 60,
			});
			expect(after.key).not.toBe("user:1");
			expect(after.window.toISOString()).toBe("2026-05-11T10:05:00.000Z");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
