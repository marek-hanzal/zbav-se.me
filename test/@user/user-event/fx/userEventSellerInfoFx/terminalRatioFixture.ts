import { DateTime } from "luxon";
import type { UserEventTableSchema } from "~/server/database/@table/UserEventTableSchema";

const createSellerTerminalRatioEvent = (
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

export const createSellerTerminalRatioSource = () => {
	const base = DateTime.fromISO("2026-01-01T10:00:00.000Z");

	return [
		createSellerTerminalRatioEvent("1", base, "transaction.create", "foreign", "tx-1"),
		createSellerTerminalRatioEvent(
			"2",
			base.plus({
				hours: 1,
			}),
			"transaction.open",
			"user",
			"tx-1",
		),
		createSellerTerminalRatioEvent(
			"3",
			base.plus({
				days: 1,
			}),
			"transaction.resolved",
			"user",
			"tx-1",
		),
		createSellerTerminalRatioEvent(
			"4",
			base.plus({
				days: 10,
			}),
			"transaction.create",
			"foreign",
			"tx-2",
		),
		createSellerTerminalRatioEvent(
			"5",
			base.plus({
				days: 11,
			}),
			"transaction.rejected",
			"user",
			"tx-2",
		),
		createSellerTerminalRatioEvent(
			"6",
			base.plus({
				days: 20,
			}),
			"transaction.create",
			"foreign",
			"tx-3",
		),
		createSellerTerminalRatioEvent(
			"7",
			base.plus({
				days: 20,
				minutes: 45,
			}),
			"transaction.message",
			"user",
			"tx-3",
		),
		createSellerTerminalRatioEvent(
			"8",
			base.plus({
				days: 22,
			}),
			"transaction.resolved",
			"user",
			"tx-3",
		),
		createSellerTerminalRatioEvent(
			"9",
			base.plus({
				days: 30,
			}),
			"transaction.create",
			"foreign",
			"tx-4",
		),
		createSellerTerminalRatioEvent(
			"10",
			base.plus({
				days: 33,
			}),
			"transaction.closed",
			"foreign",
			"tx-4",
		),
		createSellerTerminalRatioEvent(
			"11",
			base.plus({
				days: 40,
			}),
			"transaction.create",
			"foreign",
			"tx-5",
		),
		createSellerTerminalRatioEvent(
			"12",
			base.plus({
				days: 42,
			}),
			"transaction.rejected",
			"user",
			"tx-5",
		),
		createSellerTerminalRatioEvent(
			"13",
			base.plus({
				days: 50,
			}),
			"transaction.create",
			"foreign",
			"tx-6",
		),
		createSellerTerminalRatioEvent(
			"14",
			base.plus({
				days: 50,
				hours: 2,
			}),
			"transaction.open",
			"user",
			"tx-6",
		),
		createSellerTerminalRatioEvent(
			"15",
			base.plus({
				days: 51,
			}),
			"transaction.resolved",
			"user",
			"tx-6",
		),
	];
};
