import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { transactionTransitionFx } from "~/user/transaction/server/fx/transactionTransitionFx";

describe("transaction core", () => {
	it("validates the transition machine for valid and invalid requests", async () => {
		const database = await testabase("transactionCore-transition");

		return Effect.gen(function* () {
			const allowed = yield* Effect.either(
				transactionTransitionFx({
					status: "pending",
					request: "open",
					side: "seller",
				}),
			);

			const denied = yield* Effect.either(
				transactionTransitionFx({
					status: "pending",
					request: "open",
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
			expect(denied._tag).toBe("Left");
			expect(deniedTerminalWrite._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
