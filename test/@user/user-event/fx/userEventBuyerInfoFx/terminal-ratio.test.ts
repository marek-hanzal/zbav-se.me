import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import {
	computeBuyerCloser,
	computeBuyerDecision,
	computeBuyerExpired,
	computeBuyerReaction,
} from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import type { UserEventTableSchema } from "~/server/database/@table/UserEventTableSchema";

const createEvent = (
	id: string,
	createdAt: DateTime,
	event: UserEventTableSchema.Type["event"],
	scope: UserEventTableSchema.Type["scope"],
	group: string,
): UserEventTableSchema.Type => ({
	id,
	userId: "buyer-1",
	scope,
	source: "transaction",
	group,
	event,
	isTerminal:
		event !== "transaction.create" &&
		event !== "transaction.open" &&
		event !== "transaction.message",
	createdAt: createdAt.toJSDate(),
});

describe("userEventBuyerInfoFx terminal ratio", () => {
	it("computes reaction, closer, decision and expired ratios from grouped events", () => {
		const base = DateTime.fromISO("2026-01-01T10:00:00.000Z");
		const source = [
			createEvent("1", base, "transaction.create", "user", "tx-1"),
			createEvent(
				"2",
				base.plus({
					hours: 1,
				}),
				"transaction.open",
				"foreign",
				"tx-1",
			),
			createEvent(
				"3",
				base.plus({
					hours: 1,
					minutes: 10,
				}),
				"transaction.message",
				"user",
				"tx-1",
			),
			createEvent(
				"4",
				base.plus({
					days: 1,
				}),
				"transaction.success",
				"user",
				"tx-1",
			),
			createEvent(
				"5",
				base.plus({
					days: 2,
				}),
				"transaction.create",
				"user",
				"tx-2",
			),
			createEvent(
				"6",
				base.plus({
					days: 2,
					minutes: 30,
				}),
				"transaction.open",
				"foreign",
				"tx-2",
			),
			createEvent(
				"7",
				base.plus({
					days: 2,
					minutes: 35,
				}),
				"transaction.closed",
				"user",
				"tx-2",
			),
			createEvent(
				"8",
				base.plus({
					days: 4,
				}),
				"transaction.create",
				"user",
				"tx-3",
			),
			createEvent(
				"9",
				base.plus({
					days: 4,
					minutes: 10,
				}),
				"transaction.open",
				"foreign",
				"tx-3",
			),
			createEvent(
				"10",
				base.plus({
					days: 4,
					hours: 1,
				}),
				"transaction.rejected",
				"foreign",
				"tx-3",
			),
			createEvent(
				"11",
				base.plus({
					days: 6,
				}),
				"transaction.create",
				"user",
				"tx-4",
			),
			createEvent(
				"12",
				base.plus({
					days: 6,
					hours: 2,
				}),
				"transaction.open",
				"foreign",
				"tx-4",
			),
			createEvent(
				"13",
				base.plus({
					days: 9,
				}),
				"transaction.expired",
				"foreign",
				"tx-4",
			),
			createEvent(
				"14",
				base.plus({
					days: 8,
				}),
				"transaction.create",
				"user",
				"tx-5",
			),
			createEvent(
				"15",
				base.plus({
					days: 8,
					minutes: 15,
				}),
				"transaction.open",
				"foreign",
				"tx-5",
			),
			createEvent(
				"16",
				base.plus({
					days: 8,
					minutes: 30,
				}),
				"transaction.message",
				"user",
				"tx-5",
			),
			createEvent(
				"17",
				base.plus({
					days: 10,
				}),
				"transaction.success",
				"user",
				"tx-5",
			),
			createEvent(
				"18",
				base.plus({
					days: 12,
				}),
				"transaction.create",
				"user",
				"tx-6",
			),
			createEvent(
				"19",
				base.plus({
					days: 12,
					minutes: 5,
				}),
				"transaction.open",
				"foreign",
				"tx-6",
			),
			createEvent(
				"20",
				base.plus({
					days: 12,
					minutes: 10,
				}),
				"transaction.message",
				"user",
				"tx-6",
			),
			createEvent(
				"21",
				base.plus({
					days: 13,
				}),
				"transaction.closed",
				"user",
				"tx-6",
			),
		];

		expect(computeBuyerReaction(source)).toMatchObject({
			total: 6,
			reactions: 4,
			terminal: 1,
			percent: 83.33333333333334,
		});
		expect(computeBuyerCloser(source)).toMatchObject({
			total: 6,
			closed: 1,
			percent: 16.666666666666664,
		});
		expect(computeBuyerDecision(source)).toMatchObject({
			total: 6,
			decisions: 4,
			terminal: 1,
			percent: 83.33333333333334,
		});
		expect(computeBuyerExpired(source)).toMatchObject({
			total: 6,
			expired: 1,
			percent: 16.666666666666664,
		});
	});
});
