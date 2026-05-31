import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { rateLimitCheckFx } from "~/server/rate-limit/server/fx/rateLimitCheckFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("rateLimitCheckFx", () => {
	it("allows requests up to the limit and rejects the next one with rule metadata", async () => {
		const database = await testabase("rateLimitCheckFx-over-limit");
		const fixedNow = DateTime.fromISO("2026-05-11T10:05:45.000Z");

		return Effect.gen(function* () {
			yield* Effect.promise(() =>
				database.kysely
					.insertInto("rate_limit_rule")
					.values({
						name: "listing:contact",
						window: 60,
						limit: 2,
					})
					.execute(),
			);

			const first = yield* rateLimitCheckFx({
				rule: "listing:contact",
				key: [
					"user:1",
				],
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => fixedNow,
				}),
			);
			const second = yield* rateLimitCheckFx({
				rule: "listing:contact",
				key: [
					"user:1",
				],
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => fixedNow,
				}),
			);
			const third = yield* Effect.either(
				rateLimitCheckFx({
					rule: "listing:contact",
					key: [
						"user:1",
					],
				}).pipe(
					Effect.provideService(DateContextFx, {
						now: () => fixedNow,
					}),
				),
			);

			expect(first.count).toBe(1);
			expect(second.count).toBe(2);

			const error = expectTaggedErrorFx(third, {
				tag: "RateLimitErrorFx",
				message: "Rate limit 'listing:contact' exceeded: 3/2 in 60s window",
			}) as {
				rule?: string;
				limit?: number;
				count?: number;
				exceeded?: number;
				window?: number;
				retryAt?: string;
			};

			expect(error.rule).toBe("listing:contact");
			expect(error.limit).toBe(2);
			expect(error.count).toBe(3);
			expect(error.exceeded).toBe(1);
			expect(error.window).toBe(60);
			expect(error.retryAt).toBe("2026-05-11T10:06:00.000Z");

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("rate_limit_event")
					.selectAll()
					.where("rule", "=", "listing:contact")
					.execute(),
			);

			expect(rows).toHaveLength(1);
			expect(rows[0]?.count).toBe(3);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
