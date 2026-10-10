import type { DateTime } from "luxon";
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

function _createEventFn({
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
			computeLoadFn({
				source: [],
				createScope: "user",
			}),
		).toEqual({
			bucket: "low",
		});
	});
});
