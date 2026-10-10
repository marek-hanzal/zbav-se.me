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
	it("uses bucket thresholds for low, medium and high", () => {
		const base = DateTime.fromISO("2026-04-02T10:00:00.000Z");
		const source = [
			createEventFn({
				id: "1",
				group: "tx-1",
				event: "transaction.create",
				scope: "user",
				createdAt: base,
			}),
			createEventFn({
				id: "2",
				group: "tx-2",
				event: "transaction.create",
				scope: "user",
				createdAt: base.plus({
					hours: 1,
				}),
			}),
			createEventFn({
				id: "3",
				group: "tx-3",
				event: "transaction.create",
				scope: "user",
				createdAt: base.plus({
					hours: 2,
				}),
			}),
			createEventFn({
				id: "4",
				group: "tx-4",
				event: "transaction.create",
				scope: "user",
				createdAt: base.plus({
					hours: 3,
				}),
			}),
		];

		expect(
			computeLoadFn({
				source: source.slice(0, 1),
				createScope: "user",
				thresholds: {
					lowMax: 1,
					mediumMax: 3,
				},
			}),
		).toEqual({
			bucket: "low",
		});

		expect(
			computeLoadFn({
				source: source.slice(0, 3),
				createScope: "user",
				thresholds: {
					lowMax: 1,
					mediumMax: 3,
				},
			}),
		).toEqual({
			bucket: "medium",
		});

		expect(
			computeLoadFn({
				source,
				createScope: "user",
				thresholds: {
					lowMax: 1,
					mediumMax: 3,
				},
			}),
		).toEqual({
			bucket: "high",
		});
	});
});
