import { TransactionEntryKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntryKindEnumSchema";
import { TransactionSideEnumSchema } from "~/common/user-transaction/enum/TransactionSideEnumSchema";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import type { Transitions } from "~/user/transaction/server/fx/transactionTransitionFx";

export type MatrixState = Transitions.Kind | null;
export type MatrixRequest = Transitions.Kind;
export type MatrixSide = TransactionSideEnumSchema.Type | null;

export interface ExpectedTransition {
	status: MatrixState;
	request: MatrixRequest;
	side: MatrixSide;
}

export const sideOptions: readonly MatrixSide[] = [
	...TransactionSideEnumSchema.options,
	null,
];

export const requestOptions: readonly MatrixRequest[] = [
	...TransactionStatusEnumSchema.options,
	...TransactionEntryKindEnumSchema.options,
];

export const statusStateOptions: readonly MatrixState[] = [
	null,
	...requestOptions,
];

export const transitionKey = ({ status, request, side }: ExpectedTransition) => {
	return `${status ?? "null"}:${request}:${side ?? "null"}`;
};

export const buildExpectedTransitions = () => {
	const expectedTransitions: ExpectedTransition[] = [];

	const addForStates = (
		states: readonly MatrixState[],
		transitions: readonly Omit<ExpectedTransition, "status">[],
	) => {
		for (const status of states) {
			for (const transition of transitions) {
				expectedTransitions.push({
					status,
					...transition,
				});
			}
		}
	};

	addForStates(
		[
			null,
		],
		[
			{
				request: "interest",
				side: "buyer",
			},
			{
				request: "status-interest",
				side: "buyer",
			},
		],
	);

	addForStates(
		[
			"interest",
			"status-interest",
		],
		[
			{
				request: "trade",
				side: "seller",
			},
			{
				request: "status-trade",
				side: "seller",
			},
			{
				request: "rejected",
				side: "buyer",
			},
			{
				request: "rejected",
				side: "seller",
			},
			{
				request: "status-rejected-buyer",
				side: "buyer",
			},
			{
				request: "status-rejected-seller",
				side: "seller",
			},
			{
				request: "expired",
				side: null,
			},
			{
				request: "status-expired",
				side: null,
			},
			{
				request: "text",
				side: "buyer",
			},
		],
	);

	addForStates(
		[
			"trade",
			"status-trade",
		],
		[
			{
				request: "resolved",
				side: "seller",
			},
			{
				request: "status-resolved",
				side: "seller",
			},
			{
				request: "rejected",
				side: "buyer",
			},
			{
				request: "rejected",
				side: "seller",
			},
			{
				request: "status-rejected-buyer",
				side: "buyer",
			},
			{
				request: "status-rejected-seller",
				side: "seller",
			},
			{
				request: "expired",
				side: null,
			},
			{
				request: "status-expired",
				side: null,
			},
			{
				request: "text",
				side: "buyer",
			},
			{
				request: "text",
				side: "seller",
			},
			{
				request: "gallery",
				side: "buyer",
			},
			{
				request: "gallery",
				side: "seller",
			},
			{
				request: "location",
				side: "buyer",
			},
			{
				request: "location",
				side: "seller",
			},
			{
				request: "personal",
				side: "buyer",
			},
			{
				request: "personal",
				side: "seller",
			},
			{
				request: "package",
				side: "seller",
			},
		],
	);

	addForStates(
		[
			"resolved",
			"status-resolved",
		],
		[
			{
				request: "dispute",
				side: "buyer",
			},
			{
				request: "dispute",
				side: "seller",
			},
			{
				request: "status-dispute-buyer",
				side: "buyer",
			},
			{
				request: "status-dispute-seller",
				side: "seller",
			},
			{
				request: "success",
				side: "buyer",
			},
			{
				request: "closed",
				side: "buyer",
			},
			{
				request: "expired",
				side: null,
			},
			{
				request: "status-success",
				side: "buyer",
			},
			{
				request: "status-closed",
				side: "buyer",
			},
			{
				request: "status-expired",
				side: null,
			},
		],
	);

	addForStates(
		[
			"dispute",
			"status-dispute-buyer",
			"status-dispute-seller",
		],
		[
			{
				request: "resolved",
				side: "seller",
			},
			{
				request: "status-resolved",
				side: "seller",
			},
			{
				request: "success",
				side: "buyer",
			},
			{
				request: "closed",
				side: "buyer",
			},
			{
				request: "expired",
				side: null,
			},
			{
				request: "status-success",
				side: "buyer",
			},
			{
				request: "status-closed",
				side: "buyer",
			},
			{
				request: "status-expired",
				side: null,
			},
			{
				request: "text",
				side: "buyer",
			},
			{
				request: "text",
				side: "seller",
			},
			{
				request: "gallery",
				side: "buyer",
			},
			{
				request: "gallery",
				side: "seller",
			},
			{
				request: "location",
				side: "buyer",
			},
			{
				request: "location",
				side: "seller",
			},
			{
				request: "personal",
				side: "buyer",
			},
			{
				request: "personal",
				side: "seller",
			},
			{
				request: "package",
				side: "seller",
			},
		],
	);

	return expectedTransitions;
};
