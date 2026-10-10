import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import type { UserEventTableSchema } from "~/database/schema/UserEventTableSchema";
import { computeLoadFn } from "~/user-event/fn/computeLoadFn";

interface CreateEventProps {
	id: string;
	group: string;
	event: UserEventTableSchema.Type["event"];
	scope: UserEventTableSchema.Type["scope"];
	createdAt: DateTime;
}

function createEventFn({
	id,
	group,
	event,
	scope,
	createdAt,
}: CreateEventProps): UserEventTableSchema.Type {
	return {
		id,
		userId: "user-1",
		scope,
		source: "transaction",
		group,
		event,
		isTerminal:
			event === "transaction.success" ||
			event === "transaction.closed" ||
			event === "transaction.rejected" ||
			event === "transaction.expired" ||
			event === "transaction.resolved",
		createdAt: createdAt.toJSDate(),
	};
}

describe("computeLoad", () => {
	it("does not count a terminated group as active", () => {
		const base = DateTime.fromISO("2026-04-02T10:00:00.000Z");

		expect(
			computeLoadFn({
				source: [
					createEventFn({
						id: "1",
						group: "tx-1",
						event: "transaction.create",
						scope: "user",
						createdAt: base,
					}),
					createEventFn({
						id: "2",
						group: "tx-1",
						event: "transaction.success",
						scope: "user",
						createdAt: base.plus({
							hours: 1,
						}),
					}),
				],
				createScope: "user",
				thresholds: {
					lowMax: 0,
					mediumMax: 1,
				},
			}),
		).toEqual({
			bucket: "low",
		});
	});
});
