import { DateTime } from "luxon";
import type { UserEventTableSchema } from "~/database/schema/UserEventTableSchema";

const createBuyerTerminalRatioEventFn = (
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

export const createBuyerTerminalRatioSourceFn = () => {
	const base = DateTime.fromISO("2026-01-01T10:00:00.000Z");

	return [
		createBuyerTerminalRatioEventFn("1", base, "transaction.create", "user", "tx-1"),
		createBuyerTerminalRatioEventFn(
			"2",
			base.plus({
				hours: 1,
			}),
			"transaction.open",
			"foreign",
			"tx-1",
		),
		createBuyerTerminalRatioEventFn(
			"3",
			base.plus({
				hours: 1,
				minutes: 10,
			}),
			"transaction.message",
			"user",
			"tx-1",
		),
		createBuyerTerminalRatioEventFn(
			"4",
			base.plus({
				days: 1,
			}),
			"transaction.success",
			"user",
			"tx-1",
		),
		createBuyerTerminalRatioEventFn(
			"5",
			base.plus({
				days: 2,
			}),
			"transaction.create",
			"user",
			"tx-2",
		),
		createBuyerTerminalRatioEventFn(
			"6",
			base.plus({
				days: 2,
				minutes: 30,
			}),
			"transaction.open",
			"foreign",
			"tx-2",
		),
		createBuyerTerminalRatioEventFn(
			"7",
			base.plus({
				days: 2,
				minutes: 35,
			}),
			"transaction.closed",
			"user",
			"tx-2",
		),
		createBuyerTerminalRatioEventFn(
			"8",
			base.plus({
				days: 4,
			}),
			"transaction.create",
			"user",
			"tx-3",
		),
		createBuyerTerminalRatioEventFn(
			"9",
			base.plus({
				days: 4,
				minutes: 10,
			}),
			"transaction.open",
			"foreign",
			"tx-3",
		),
		createBuyerTerminalRatioEventFn(
			"10",
			base.plus({
				days: 4,
				hours: 1,
			}),
			"transaction.rejected",
			"foreign",
			"tx-3",
		),
		createBuyerTerminalRatioEventFn(
			"11",
			base.plus({
				days: 6,
			}),
			"transaction.create",
			"user",
			"tx-4",
		),
		createBuyerTerminalRatioEventFn(
			"12",
			base.plus({
				days: 6,
				hours: 2,
			}),
			"transaction.open",
			"foreign",
			"tx-4",
		),
		createBuyerTerminalRatioEventFn(
			"13",
			base.plus({
				days: 9,
			}),
			"transaction.expired",
			"foreign",
			"tx-4",
		),
		createBuyerTerminalRatioEventFn(
			"14",
			base.plus({
				days: 8,
			}),
			"transaction.create",
			"user",
			"tx-5",
		),
		createBuyerTerminalRatioEventFn(
			"15",
			base.plus({
				days: 8,
				minutes: 15,
			}),
			"transaction.open",
			"foreign",
			"tx-5",
		),
		createBuyerTerminalRatioEventFn(
			"16",
			base.plus({
				days: 8,
				minutes: 30,
			}),
			"transaction.message",
			"user",
			"tx-5",
		),
		createBuyerTerminalRatioEventFn(
			"17",
			base.plus({
				days: 10,
			}),
			"transaction.success",
			"user",
			"tx-5",
		),
		createBuyerTerminalRatioEventFn(
			"18",
			base.plus({
				days: 12,
			}),
			"transaction.create",
			"user",
			"tx-6",
		),
		createBuyerTerminalRatioEventFn(
			"19",
			base.plus({
				days: 12,
				minutes: 5,
			}),
			"transaction.open",
			"foreign",
			"tx-6",
		),
		createBuyerTerminalRatioEventFn(
			"20",
			base.plus({
				days: 12,
				minutes: 10,
			}),
			"transaction.message",
			"user",
			"tx-6",
		),
		createBuyerTerminalRatioEventFn(
			"21",
			base.plus({
				days: 13,
			}),
			"transaction.closed",
			"user",
			"tx-6",
		),
	];
};
