import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import {
	computeSellerExpired,
	computeSellerReaction,
	computeSellerRejected,
	computeSellerResolved,
} from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import type { UserEventTableSchema } from "~/server/database/@table/UserEventTableSchema";

const createEvent = (
	id: string,
	createdAt: DateTime,
	event: UserEventTableSchema.Type["event"],
	scope: UserEventTableSchema.Type["scope"],
	group: string,
): UserEventTableSchema.Type => ({
	id,
	userId: "seller-1",
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

describe("userEventSellerInfoFx terminal ratio", () => {
	it("computes reaction, rejected, resolved and expired ratios from grouped events", () => {
		const base = DateTime.fromISO("2026-01-01T10:00:00.000Z");
		const source = [
			createEvent("1", base, "transaction.create", "foreign", "tx-1"),
			createEvent(
				"2",
				base.plus({
					hours: 1,
				}),
				"transaction.open",
				"user",
				"tx-1",
			),
			createEvent(
				"3",
				base.plus({
					days: 1,
				}),
				"transaction.resolved",
				"user",
				"tx-1",
			),
			createEvent(
				"4",
				base.plus({
					days: 10,
				}),
				"transaction.create",
				"foreign",
				"tx-2",
			),
			createEvent(
				"5",
				base.plus({
					days: 11,
				}),
				"transaction.rejected",
				"user",
				"tx-2",
			),
			createEvent(
				"6",
				base.plus({
					days: 20,
				}),
				"transaction.create",
				"foreign",
				"tx-3",
			),
			createEvent(
				"7",
				base.plus({
					days: 20,
					minutes: 45,
				}),
				"transaction.message",
				"user",
				"tx-3",
			),
			createEvent(
				"8",
				base.plus({
					days: 22,
				}),
				"transaction.resolved",
				"user",
				"tx-3",
			),
			createEvent(
				"9",
				base.plus({
					days: 30,
				}),
				"transaction.create",
				"foreign",
				"tx-4",
			),
			createEvent(
				"10",
				base.plus({
					days: 33,
				}),
				"transaction.closed",
				"foreign",
				"tx-4",
			),
			createEvent(
				"11",
				base.plus({
					days: 40,
				}),
				"transaction.create",
				"foreign",
				"tx-5",
			),
			createEvent(
				"12",
				base.plus({
					days: 42,
				}),
				"transaction.rejected",
				"user",
				"tx-5",
			),
			createEvent(
				"13",
				base.plus({
					days: 50,
				}),
				"transaction.create",
				"foreign",
				"tx-6",
			),
			createEvent(
				"14",
				base.plus({
					days: 50,
					hours: 2,
				}),
				"transaction.open",
				"user",
				"tx-6",
			),
			createEvent(
				"15",
				base.plus({
					days: 51,
				}),
				"transaction.resolved",
				"user",
				"tx-6",
			),
		];

		expect(computeSellerReaction(source)).toMatchObject({
			total: 6,
			reactions: 5,
			terminal: 1,
			percent: 100,
		});
		expect(computeSellerRejected(source)).toMatchObject({
			total: 6,
			rejected: 2,
			percent: 33.33333333333333,
		});
		expect(computeSellerResolved(source)).toMatchObject({
			total: 6,
			resolved: 3,
			terminal: 3,
			percent: 50,
		});
		expect(computeSellerExpired(source)).toMatchObject({
			total: 6,
			expired: 0,
			percent: 0,
		});
	});
});
