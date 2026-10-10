import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { keyOfFn } from "~/hash/fn/keyOfFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { userInteractionEventFx } from "~/user-event/fx/userInteractionEventFx";

describe("userInteractionEventFx", () => {
	it("writes one user-scoped event and one foreign-scoped event", async () => {
		const group = "tx-1";
		const database = await testabaseFn("userInteractionEventFx");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});

			yield* userInteractionEventFx({
				userId: users.buyer.id,
				targetId: users.seller.id,
				source: "transaction",
				group,
				event: "transaction.message",
				isTerminal: false,
			});

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("user_event")
					.select([
						"userId",
						"scope",
						"source",
						"event",
						"isTerminal",
					])
					.where("group", "=", keyOfFn(group))
					.orderBy("scope", "asc")
					.execute(),
			);

			expect(rows).toHaveLength(2);
			expect(rows).toContainEqual({
				userId: users.seller.id,
				scope: "foreign",
				source: "transaction",
				event: "transaction.message",
				isTerminal: false,
			});
			expect(rows).toContainEqual({
				userId: users.buyer.id,
				scope: "user",
				source: "transaction",
				event: "transaction.message",
				isTerminal: false,
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
