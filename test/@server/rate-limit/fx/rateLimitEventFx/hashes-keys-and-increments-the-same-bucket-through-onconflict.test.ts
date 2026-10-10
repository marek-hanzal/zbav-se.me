import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { hashFn } from "~/hmac/fn/hashFn";
import { rateLimitEventFx } from "~/rate-limit/fx/rateLimitEventFx";
import { ServerHmacSchema } from "~/server-env/schema/ServerHmacSchema";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

describe("rateLimitEventFx", () => {
	it("hashes keys and increments the same bucket through onConflict", async () => {
		const database = await testabaseFn("rateLimitEventFx-same-bucket");
		const hmacConfig = ServerHmacSchema.parse(process.env);

		return Effect.gen(function* () {
			yield* Effect.promise(() =>
				database.kysely
					.insertInto("rate_limit_rule")
					.values({
						name: "listing:impression",
						window: 60,
						limit: 5,
					})
					.execute(),
			);

			const fixedNow = DateTime.fromISO("2026-05-11T10:05:45.000Z");
			const first = yield* rateLimitEventFx({
				rule: "listing:impression",
				key: [
					"user:1",
					"route:/listing/abc",
				],
			}).pipe(
				withDateServiceFn({
					nowFn: () => fixedNow,
				}),
			);
			const second = yield* rateLimitEventFx({
				rule: "listing:impression",
				key: [
					"user:1",
					"route:/listing/abc",
				],
			}).pipe(
				withDateServiceFn({
					nowFn: () => fixedNow,
				}),
			);

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("rate_limit_event")
					.selectAll()
					.where("rule", "=", "listing:impression")
					.execute(),
			);

			expect(first.count).toBe(1);
			expect(second.count).toBe(2);
			expect(first.limit).toBe(5);
			expect(second.limit).toBe(5);
			expect(rows).toHaveLength(1);
			expect(rows[0]).toMatchObject({
				rule: "listing:impression",
				key: hashFn({
					key: [
						"user:1",
						"route:/listing/abc",
					],
					secret: hmacConfig.SERVER_HMAC_SECRET,
				}),
				count: 2,
			});
			expect(rows[0]?.window.toISOString()).toBe("2026-05-11T10:05:00.000Z");
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
