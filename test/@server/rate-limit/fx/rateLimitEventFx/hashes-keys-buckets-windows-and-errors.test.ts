import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { hash } from "@/lib/server/hmac";
import { ServerHmacSchema } from "~/server/env/ServerHmacSchema";
import { rateLimitEventFx } from "~/server/rate-limit/server/fx/rateLimitEventFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("rateLimitEventFx", () => {
	it("hashes keys and increments the same bucket through onConflict", async () => {
		const database = await testabase("rateLimitEventFx-same-bucket");
		const hmacConfig = ServerHmacSchema.parse(process.env);

		return Effect.gen(function* () {
			yield* Effect.promise(() =>
				database.kysely
					.insertInto("rate_limit_rule")
					.values({
						name: "listing-impression",
						window: 60,
						limit: 5,
					})
					.execute(),
			);

			const fixedNow = DateTime.fromISO("2026-05-11T10:05:45.000Z");
			const first = yield* rateLimitEventFx({
				rule: "listing-impression",
				key: [
					"user:1",
					"route:/listing/abc",
				],
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => fixedNow,
				}),
			);
			const second = yield* rateLimitEventFx({
				rule: "listing-impression",
				key: [
					"user:1",
					"route:/listing/abc",
				],
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => fixedNow,
				}),
			);

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("rate_limit_event")
					.selectAll()
					.where("rule", "=", "listing-impression")
					.execute(),
			);

			expect(first.count).toBe(1);
			expect(second.count).toBe(2);
			expect(first.limit).toBe(5);
			expect(second.limit).toBe(5);
			expect(rows).toHaveLength(1);
			expect(rows[0]).toMatchObject({
				rule: "listing-impression",
				key: hash({
					key: [
						"user:1",
						"route:/listing/abc",
					],
					secret: hmacConfig.SERVER_HMAC_SECRET,
				}),
				count: 2,
			});
			expect(rows[0]?.window.toISOString()).toBe("2026-05-11T10:05:00.000Z");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("separates buckets by time window and hashed key", async () => {
		const database = await testabase("rateLimitEventFx-window-and-key-split");
		const hmacConfig = ServerHmacSchema.parse(process.env);

		return Effect.gen(function* () {
			yield* Effect.promise(() =>
				database.kysely
					.insertInto("rate_limit_rule")
					.values({
						name: "listing-contact",
						window: 60,
						limit: 2,
					})
					.execute(),
			);

			yield* rateLimitEventFx({
				rule: "listing-contact",
				key: [
					"user:1",
				],
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => DateTime.fromISO("2026-05-11T10:05:59.000Z"),
				}),
			);
			yield* rateLimitEventFx({
				rule: "listing-contact",
				key: [
					"user:1",
				],
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => DateTime.fromISO("2026-05-11T10:06:00.000Z"),
				}),
			);
			yield* rateLimitEventFx({
				rule: "listing-contact",
				key: [
					"user:2",
				],
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => DateTime.fromISO("2026-05-11T10:06:15.000Z"),
				}),
			);

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("rate_limit_event")
					.select([
						"key",
						"window",
						"count",
					])
					.where("rule", "=", "listing-contact")
					.orderBy("window", "asc")
					.orderBy("key", "asc")
					.execute(),
			);

			expect(rows).toHaveLength(3);
			expect(
				rows.map((item) => ({
					key: item.key,
					window: item.window.toISOString(),
					count: item.count,
				})),
			).toEqual([
				{
					key: hash({
						key: [
							"user:1",
						],
						secret: hmacConfig.SERVER_HMAC_SECRET,
					}),
					window: "2026-05-11T10:05:00.000Z",
					count: 1,
				},
				{
					key: hash({
						key: [
							"user:1",
						],
						secret: hmacConfig.SERVER_HMAC_SECRET,
					}),
					window: "2026-05-11T10:06:00.000Z",
					count: 1,
				},
				{
					key: hash({
						key: [
							"user:2",
						],
						secret: hmacConfig.SERVER_HMAC_SECRET,
					}),
					window: "2026-05-11T10:06:00.000Z",
					count: 1,
				},
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("fails with not found when the rule does not exist", async () => {
		const database = await testabase("rateLimitEventFx-missing-rule");

		return Effect.gen(function* () {
			const result = yield* Effect.either(
				rateLimitEventFx({
					rule: "missing-rule",
					key: [
						"user:404",
					],
				}),
			);

			expectTaggedErrorFx(result, {
				tag: "NotFoundErrorFx",
				messageIncludes: "missing-rule",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
