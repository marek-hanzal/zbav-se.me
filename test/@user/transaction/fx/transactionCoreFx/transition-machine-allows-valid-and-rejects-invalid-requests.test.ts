import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { TransactionEntryKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntryKindEnumSchema";
import { TransactionSideEnumSchema } from "~/common/user-transaction/enum/TransactionSideEnumSchema";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import type { Transitions } from "~/user/transaction/server/fx/transactionTransitionFx";
import { transactionTransitionFx } from "~/user/transaction/server/fx/transactionTransitionFx";

type MatrixState = Transitions.Kind | null;
type MatrixRequest = Transitions.Kind;
type MatrixSide = TransactionSideEnumSchema.Type | null;

interface ExpectedTransition {
	status: MatrixState;
	request: MatrixRequest;
	side: MatrixSide;
}

const sideOptions: readonly MatrixSide[] = [
	...TransactionSideEnumSchema.options,
	null,
];

const requestOptions: readonly MatrixRequest[] = [
	...TransactionStatusEnumSchema.options,
	...TransactionEntryKindEnumSchema.options,
];

const statusStateOptions: readonly MatrixState[] = [
	null,
	...requestOptions,
];

const transitionKey = ({ status, request, side }: ExpectedTransition) => {
	return `${status ?? "null"}:${request}:${side ?? "null"}`;
};

const buildExpectedTransitions = () => {
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

describe("transaction core", () => {
	it("validates the transition machine for valid and invalid requests", async () => {
		const database = await testabase("transactionCore-transition");

		return Effect.gen(function* () {
			const allowed = yield* Effect.either(
				transactionTransitionFx({
					status: "interest",
					request: "trade",
					side: "seller",
				}),
			);

			const denied = yield* Effect.either(
				transactionTransitionFx({
					status: "interest",
					request: "trade",
					side: "buyer",
				}),
			);

			const deniedTerminalWrite = yield* Effect.either(
				transactionTransitionFx({
					status: "sold",
					request: "text",
					side: "buyer",
				}),
			);

			expect(allowed._tag).toBe("Right");
			expectTaggedErrorFx(denied, {
				tag: "InvalidRequestErrorFx",
			});
			expectTaggedErrorFx(deniedTerminalWrite, {
				tag: "InvalidRequestErrorFx",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("matches the full transaction transition matrix", async () => {
		const database = await testabase("transactionCore-transition-matrix");

		return Effect.gen(function* () {
			const expectedTransitions = buildExpectedTransitions();
			const expectedTransitionKeys = new Set(expectedTransitions.map(transitionKey));
			const unexpectedDenied: string[] = [];
			const unexpectedAllowed: string[] = [];

			for (const transition of expectedTransitions) {
				const result = yield* Effect.either(transactionTransitionFx(transition));

				if (result._tag === "Left") {
					unexpectedDenied.push(transitionKey(transition));
				}
			}

			for (const status of statusStateOptions) {
				for (const request of requestOptions) {
					for (const side of sideOptions) {
						const transition = {
							status,
							request,
							side,
						};
						const key = transitionKey(transition);

						if (expectedTransitionKeys.has(key)) {
							continue;
						}

						const result = yield* Effect.either(transactionTransitionFx(transition));

						if (result._tag === "Right") {
							unexpectedAllowed.push(key);
						}
					}
				}
			}

			expect(unexpectedDenied).toEqual([]);
			expect(unexpectedAllowed).toEqual([]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
