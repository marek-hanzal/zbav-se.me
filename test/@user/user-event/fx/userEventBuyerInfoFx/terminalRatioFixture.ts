import { DateTime } from "luxon";
import type { UserEventTableSchema } from "~/server/database/@table/UserEventTableSchema";

const createBuyerTerminalRatioEvent = (
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

export const createBuyerTerminalRatioSource = () => {
	const base = DateTime.fromISO("2026-01-01T10:00:00.000Z");

	return [
		createBuyerTerminalRatioEvent("1", base, "transaction.create", "user", "tx-1"),
		createBuyerTerminalRatioEvent(
			"2",
			base.plus({
				hours: 1,
			}),
			"transaction.open",
			"foreign",
			"tx-1",
		),
		createBuyerTerminalRatioEvent(
			"3",
			base.plus({
				hours: 1,
				minutes: 10,
			}),
			"transaction.message",
			"user",
			"tx-1",
		),
		createBuyerTerminalRatioEvent(
			"4",
			base.plus({
				days: 1,
			}),
			"transaction.success",
			"user",
			"tx-1",
		),
		createBuyerTerminalRatioEvent(
			"5",
			base.plus({
				days: 2,
			}),
			"transaction.create",
			"user",
			"tx-2",
		),
		createBuyerTerminalRatioEvent(
			"6",
			base.plus({
				days: 2,
				minutes: 30,
			}),
			"transaction.open",
			"foreign",
			"tx-2",
		),
		createBuyerTerminalRatioEvent(
			"7",
			base.plus({
				days: 2,
				minutes: 35,
			}),
			"transaction.closed",
			"user",
			"tx-2",
		),
		createBuyerTerminalRatioEvent(
			"8",
			base.plus({
				days: 4,
			}),
			"transaction.create",
			"user",
			"tx-3",
		),
		createBuyerTerminalRatioEvent(
			"9",
			base.plus({
				days: 4,
				minutes: 10,
			}),
			"transaction.open",
			"foreign",
			"tx-3",
		),
		createBuyerTerminalRatioEvent(
			"10",
			base.plus({
				days: 4,
				hours: 1,
			}),
			"transaction.rejected",
			"foreign",
			"tx-3",
		),
		createBuyerTerminalRatioEvent(
			"11",
			base.plus({
				days: 6,
			}),
			"transaction.create",
			"user",
			"tx-4",
		),
		createBuyerTerminalRatioEvent(
			"12",
			base.plus({
				days: 6,
				hours: 2,
			}),
			"transaction.open",
			"foreign",
			"tx-4",
		),
		createBuyerTerminalRatioEvent(
			"13",
			base.plus({
				days: 9,
			}),
			"transaction.expired",
			"foreign",
			"tx-4",
		),
		createBuyerTerminalRatioEvent(
			"14",
			base.plus({
				days: 8,
			}),
			"transaction.create",
			"user",
			"tx-5",
		),
		createBuyerTerminalRatioEvent(
			"15",
			base.plus({
				days: 8,
				minutes: 15,
			}),
			"transaction.open",
			"foreign",
			"tx-5",
		),
		createBuyerTerminalRatioEvent(
			"16",
			base.plus({
				days: 8,
				minutes: 30,
			}),
			"transaction.message",
			"user",
			"tx-5",
		),
		createBuyerTerminalRatioEvent(
			"17",
			base.plus({
				days: 10,
			}),
			"transaction.success",
			"user",
			"tx-5",
		),
		createBuyerTerminalRatioEvent(
			"18",
			base.plus({
				days: 12,
			}),
			"transaction.create",
			"user",
			"tx-6",
		),
		createBuyerTerminalRatioEvent(
			"19",
			base.plus({
				days: 12,
				minutes: 5,
			}),
			"transaction.open",
			"foreign",
			"tx-6",
		),
		createBuyerTerminalRatioEvent(
			"20",
			base.plus({
				days: 12,
				minutes: 10,
			}),
			"transaction.message",
			"user",
			"tx-6",
		),
		createBuyerTerminalRatioEvent(
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
