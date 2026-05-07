import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { transactionTransitionFx } from "~/user/transaction/server/fx/transactionTransitionFx";

describe("transaction core", () => {
	it("validates valid and invalid transition requests", async () => {
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
});
