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
	it("counts multiple active groups and respects the create scope", () => {
		const base = DateTime.fromISO("2026-04-02T10:00:00.000Z");

		expect(
			computeLoad({
				source: [
					createEvent({
						id: "1",
						group: "tx-1",
						event: "transaction.create",
						scope: "foreign",
						createdAt: base,
					}),
					createEvent({
						id: "2",
						group: "tx-2",
						event: "transaction.create",
						scope: "foreign",
						createdAt: base.plus({
							hours: 1,
						}),
					}),
					createEvent({
						id: "3",
						group: "tx-3",
						event: "transaction.create",
						scope: "user",
						createdAt: base.plus({
							hours: 2,
						}),
					}),
				],
				createScope: "foreign",
				thresholds: {
					lowMax: 1,
					mediumMax: 2,
				},
			}),
		).toEqual({
			bucket: "medium",
		});
	});
});
