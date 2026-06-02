import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
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
	it("returns low for old user activity and uses the latest user event", () => {
		const now = DateTime.fromISO("2026-04-02T10:00:00.000Z");

		expect(
			Effect.runSync(
				computeActivityFx({
					source: [
						createEvent({
							id: "user-old",
							createdAt: now.minus({
								days: 80,
							}),
							scope: "user",
						}),
						createEvent({
							id: "user-latest",
							createdAt: now.minus({
								days: 61,
							}),
							scope: "user",
						}),
						createEvent({
							id: "foreign-newer",
							createdAt: now.minus({
								days: 1,
							}),
							scope: "foreign",
						}),
					],
					days: 90,
				}).pipe(
					Effect.provideService(DateContextFx, {
						now: () => now,
					}),
				),
			),
		).toEqual({
			bucket: "low",
		});
	});
});
