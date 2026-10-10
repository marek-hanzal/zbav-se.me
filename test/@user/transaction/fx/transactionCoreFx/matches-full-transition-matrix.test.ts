import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import {
	buildExpectedTransitionsFn,
	requestOptions,
	sideOptions,
	statusStateOptions,
	transitionKeyFn,
} from "~/test/transaction/fx/transactionTransitionMatrixFx";
import { transactionTransitionFx } from "~/user-transaction/fx/transactionTransitionFx";

describe("transaction core", () => {
	it("matches the full transaction transition matrix", async () => {
		const database = await testabaseFn("transactionCore-transition-matrix");

		return Effect.gen(function* () {
			const expectedTransitions = buildExpectedTransitionsFn();
			const expectedTransitionKeys = new Set(expectedTransitions.map(transitionKeyFn));
			const unexpectedDenied: string[] = [];
			const unexpectedAllowed: string[] = [];

			for (const transition of expectedTransitions) {
				const result = yield* Effect.result(transactionTransitionFx(transition));

				if (result._tag === "Failure") {
					unexpectedDenied.push(transitionKeyFn(transition));
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
						const key = transitionKeyFn(transition);

						if (expectedTransitionKeys.has(key)) {
							continue;
						}

						const result = yield* Effect.result(transactionTransitionFx(transition));

						if (result._tag === "Success") {
							unexpectedAllowed.push(key);
						}
					}
				}
			}

			expect(unexpectedDenied).toEqual([]);
			expect(unexpectedAllowed).toEqual([]);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
