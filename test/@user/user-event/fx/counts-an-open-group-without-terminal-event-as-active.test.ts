import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import type { UserEventTableSchema } from "~/server/database/@table/UserEventTableSchema";
import { computeLoad } from "~/user/user-event/server/fx/computeLoad";

interface CreateEventProps {
	id: string;
	group: string;
	event: UserEventTableSchema.Type["event"];
	scope: UserEventTableSchema.Type["scope"];
	createdAt: DateTime;
}

function createEvent({
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
	it("counts an open group without terminal event as active", () => {
		const base = DateTime.fromISO("2026-04-02T10:00:00.000Z");

		expect(
			computeLoad({
				source: [
					createEvent({
						id: "1",
						group: "tx-1",
						event: "transaction.create",
						scope: "user",
						createdAt: base,
					}),
					createEvent({
						id: "2",
						group: "tx-1",
						event: "transaction.open",
						scope: "foreign",
						createdAt: base.plus({
							minutes: 5,
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
			bucket: "medium",
		});
	});
});
