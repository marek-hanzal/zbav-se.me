import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import {
	buildExpectedTransitions,
	requestOptions,
	sideOptions,
	statusStateOptions,
	transitionKey,
} from "~/test/transaction/fx/transactionTransitionMatrixFx";
import { transactionTransitionFx } from "~/user/transaction/server/fx/transactionTransitionFx";

describe("transaction core", () => {
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
