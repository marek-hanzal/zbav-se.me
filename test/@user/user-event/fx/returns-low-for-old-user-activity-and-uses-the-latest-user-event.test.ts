import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import type { UserEventTableSchema } from "~/database/schema/UserEventTableSchema";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { computeActivityFx } from "~/user-event/fx/computeActivityFx";

interface CreateEventProps {
	id: string;
	createdAt: DateTime;
	scope: UserEventTableSchema.Type["scope"];
}

function createEventFn({ id, createdAt, scope }: CreateEventProps): UserEventTableSchema.Type {
	return {
		id,
		userId: "user-1",
		scope,
		source: "transaction",
		group: "tx-1",
		event: "transaction.message",
		isTerminal: false,
		createdAt: createdAt.toJSDate(),
	};
}

describe("computeActivityFx", () => {
	it("returns low for old user activity and uses the latest user event", () => {
		const now = DateTime.fromISO("2026-04-02T10:00:00.000Z");

		expect(
			Effect.runSync(
				computeActivityFx({
					source: [
						createEventFn({
							id: "user-old",
							createdAt: now.minus({
								days: 80,
							}),
							scope: "user",
						}),
						createEventFn({
							id: "user-latest",
							createdAt: now.minus({
								days: 61,
							}),
							scope: "user",
						}),
						createEventFn({
							id: "foreign-newer",
							createdAt: now.minus({
								days: 1,
							}),
							scope: "foreign",
						}),
					],
					days: 90,
				}).pipe(
					withDateServiceFn({
						nowFn: () => now,
					}),
				),
			),
		).toEqual({
			bucket: "low",
		});
	});
});
