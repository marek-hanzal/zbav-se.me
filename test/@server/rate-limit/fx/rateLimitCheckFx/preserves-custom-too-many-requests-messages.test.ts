import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFx } from "@/lib/common/date";
import { rateLimitCheckFx } from "~/server/rate-limit/server/fx/rateLimitCheckFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("rateLimitCheckFx", () => {
	it("preserves custom too-many-requests messages", async () => {
		const database = await testabase("rateLimitCheckFx-custom-message");
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

			const result = yield* Effect.either(
				rateLimitCheckFx({
					rule: "listing:flag",
					key: [
						"user:1",
						"listing:1",
					],
					message: "You have already flagged this listing",
				}).pipe(
					withDateServiceFx({
						now: () => fixedNow,
					}),
				),
			);

			const error = expectTaggedErrorFx(result, {
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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
