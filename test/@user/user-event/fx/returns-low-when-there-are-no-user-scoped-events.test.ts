import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFx } from "@/lib/common/date";
import type { UserEventTableSchema } from "~/server/database/@table/UserEventTableSchema";
import { computeActivityFx } from "~/user/user-event/server/fx/computeActivityFx";

interface CreateEventProps {
	id: string;
	createdAt: DateTime;
	scope: UserEventTableSchema.Type["scope"];
}

function createEvent({ id, createdAt, scope }: CreateEventProps): UserEventTableSchema.Type {
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
	it("returns low when there are no user-scoped events", () => {
		const now = DateTime.fromISO("2026-04-02T10:00:00.000Z");

		expect(
			Effect.runSync(
				computeActivityFx({
					source: [
						createEvent({
							id: "foreign-1",
							createdAt: now.minus({
								days: 1,
							}),
							scope: "foreign",
						}),
					],
					days: 90,
				}).pipe(
					withDateServiceFx({
						now: () => now,
					}),
				),
			),
		).toEqual({
			bucket: "low",
		});
	});
});
