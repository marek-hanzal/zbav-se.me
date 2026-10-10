import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { rateLimitEventFx } from "~/rate-limit/fx/rateLimitEventFx";
import { rateLimitFx } from "~/rate-limit/fx/rateLimitFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

describe("rateLimitFx", () => {
	it("returns current window snapshot without incrementing count", async () => {
		const database = await testabaseFn("rateLimitFx-current-window-snapshot");
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
				withDateServiceFn({
					nowFn: () => fixedNow,
				}),
			);

			yield* rateLimitEventFx({
				rule: "listing:snapshot",
				key: [
					"user:1",
				],
			}).pipe(
				withDateServiceFn({
					nowFn: () => fixedNow,
				}),
			);

			const after = yield* rateLimitFx({
				rule: "listing:snapshot",
				key: [
					"user:1",
				],
			}).pipe(
				withDateServiceFn({
					nowFn: () => fixedNow,
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
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
