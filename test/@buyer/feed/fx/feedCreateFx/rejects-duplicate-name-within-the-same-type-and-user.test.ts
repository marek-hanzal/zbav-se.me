import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("feedCreateFx", () => {
	it("rejects duplicate feed names only within the same type and user", async () => {
		const database = await testabase("feedCreateFx-duplicate-name-type-user");

		return Effect.gen(function* () {
			const owner = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			const first = yield* feedCreateFx({
				userId: owner.id,
				type: "search",
				name: "Saved finds",
				query: {
					where: {
						fulltext: [
							"monitor",
						],
					},
				},
			});
			const sameNameOtherType = yield* feedCreateFx({
				userId: owner.id,
				type: "user",
				name: "Saved finds",
				query: {},
			});
			const sameNameOtherUser = yield* feedCreateFx({
				userId: stranger.id,
				type: "search",
				name: "Saved finds",
				query: {},
			});
			const duplicate = yield* Effect.either(
				feedCreateFx({
					userId: owner.id,
					type: "search",
					name: "Saved finds",
					query: {},
				}),
			);

			expect(first.type).toBe("search");
			expect(sameNameOtherType.type).toBe("user");
			expect(sameNameOtherUser.userId).toBe(stranger.id);
			expectTaggedErrorFx(duplicate, {
				tag: "ConflictErrorFx",
				message: "Feed already exists",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
