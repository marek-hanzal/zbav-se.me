import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { hashFn } from "~/hmac/fn/hashFn";
import { rateLimitEventFx } from "~/rate-limit/fx/rateLimitEventFx";
import { ServerHmacSchema } from "~/server-env/schema/ServerHmacSchema";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

type BucketRow = {
	key: string;
	window: string;
	count: number;
};

function compareBucketRowsFn(a: BucketRow, b: BucketRow) {
	return a.window.localeCompare(b.window) || a.key.localeCompare(b.key);
}

describe("rateLimitEventFx", () => {
	it("separates buckets by time window and hashed key", async () => {
		const database = await testabaseFn("rateLimitEventFx-window-and-key-split");
		const hmacConfig = ServerHmacSchema.parse(process.env);

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

			yield* rateLimitEventFx({
				rule: "listing:contact",
				key: [
					"user:1",
				],
			}).pipe(
				withDateServiceFn({
					nowFn: () => DateTime.fromISO("2026-05-11T10:05:59.000Z"),
				}),
			);
			yield* rateLimitEventFx({
				rule: "listing:contact",
				key: [
					"user:1",
				],
			}).pipe(
				withDateServiceFn({
					nowFn: () => DateTime.fromISO("2026-05-11T10:06:00.000Z"),
				}),
			);
			yield* rateLimitEventFx({
				rule: "listing:contact",
				key: [
					"user:2",
				],
			}).pipe(
				withDateServiceFn({
					nowFn: () => DateTime.fromISO("2026-05-11T10:06:15.000Z"),
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
					.where("rule", "=", "listing:contact")
					.orderBy("window", "asc")
					.orderBy("key", "asc")
					.execute(),
			);

			expect(rows).toHaveLength(3);
			const actual: BucketRow[] = rows.map((item) => ({
				key: item.key,
				window: item.window.toISOString(),
				count: item.count,
			}));
			const expected: BucketRow[] = [
				{
					key: hashFn({
						key: [
							"user:1",
						],
						secret: hmacConfig.SERVER_HMAC_SECRET,
					}),
					window: "2026-05-11T10:05:00.000Z",
					count: 1,
				},
				{
					key: hashFn({
						key: [
							"user:2",
						],
						secret: hmacConfig.SERVER_HMAC_SECRET,
					}),
					window: "2026-05-11T10:06:00.000Z",
					count: 1,
				},
				{
					key: hashFn({
						key: [
							"user:1",
						],
						secret: hmacConfig.SERVER_HMAC_SECRET,
					}),
					window: "2026-05-11T10:06:00.000Z",
					count: 1,
				},
			];

			expect(actual.toSorted(compareBucketRowsFn)).toEqual(
				expected.toSorted(compareBucketRowsFn),
			);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
