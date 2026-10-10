import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { rateLimitCheckFx } from "~/rate-limit/fx/rateLimitCheckFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

describe("rateLimitCheckFx", () => {
	it("preserves custom too-many-requests messages", async () => {
		const database = await testabaseFn("rateLimitCheckFx-custom-message");
		const fixedNow = DateTime.fromISO("2026-05-11T10:05:45.000Z");

		return Effect.gen(function* () {
			yield* Effect.promise(() =>
				database.kysely
					.insertInto("rate_limit_rule")
					.values({
						name: "listing:flag",
						window: 60,
						limit: 0,
					})
					.execute(),
			);

			const result = yield* Effect.result(
				rateLimitCheckFx({
					rule: "listing:flag",
					key: [
						"user:1",
						"listing:1",
					],
					message: "You have already flagged this listing",
				}).pipe(
					withDateServiceFn({
						nowFn: () => fixedNow,
					}),
				),
			);

			const error = expectTaggedErrorFn(result, {
				tag: "RateLimitErrorFx",
				message: "You have already flagged this listing",
			}) as {
				rule?: string;
				limit?: number;
				count?: number;
				exceeded?: number;
			};

			expect(error.rule).toBe("listing:flag");
			expect(error.limit).toBe(0);
			expect(error.count).toBe(1);
			expect(error.exceeded).toBe(1);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
