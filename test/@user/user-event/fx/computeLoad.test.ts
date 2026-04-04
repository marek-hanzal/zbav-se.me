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
	it("returns low for empty input", () => {
		expect(
			computeLoad({
				source: [],
				createScope: "user",
			}),
		).toEqual({
			bucket: "low",
		});
	});

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

	it("does not count a terminated group as active", () => {
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

	it("uses bucket thresholds for low, medium and high", () => {
		const base = DateTime.fromISO("2026-04-02T10:00:00.000Z");
		const source = [
			createEvent({
				id: "1",
				group: "tx-1",
				event: "transaction.create",
				scope: "user",
				createdAt: base,
			}),
			createEvent({
				id: "2",
				group: "tx-2",
				event: "transaction.create",
				scope: "user",
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
			createEvent({
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
			computeLoad({
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
			computeLoad({
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
			computeLoad({
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
