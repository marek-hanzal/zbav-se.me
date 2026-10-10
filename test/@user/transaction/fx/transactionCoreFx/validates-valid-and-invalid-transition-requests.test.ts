import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { transactionTransitionFx } from "~/user-transaction/fx/transactionTransitionFx";

describe("transaction core", () => {
	it("validates valid and invalid transition requests", async () => {
		const database = await testabaseFn("transactionCore-transition");

		return Effect.gen(function* () {
			const allowed = yield* Effect.result(
				transactionTransitionFx({
					status: "interest",
					request: "trade",
					side: "seller",
				}),
			);

			const denied = yield* Effect.result(
				transactionTransitionFx({
					status: "interest",
					request: "trade",
					side: "buyer",
				}),
			);

			const deniedTerminalWrite = yield* Effect.result(
				transactionTransitionFx({
					status: "sold",
					request: "text",
					side: "buyer",
				}),
			);

			expect(allowed._tag).toBe("Success");
			expectTaggedErrorFn(denied, {
				tag: "InvalidRequestErrorFx",
			});
			expectTaggedErrorFn(deniedTerminalWrite, {
				tag: "InvalidRequestErrorFx",
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
