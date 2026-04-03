import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { userExTokenDisableFx } from "~/user/user-ex/server/fx/userExTokenDisableFx";
import { userExTokenEnableFx } from "~/user/user-ex/server/fx/userExTokenEnableFx";

describe("userEx token lifecycle", () => {
	it("enables, rotates and disables token for a user", async () => {
		const database = await testabase("userExTokenLifecycle");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			const first = yield* userExTokenEnableFx({
				userId: user.id,
			});

			expect(typeof first.token).toBe("string");
			expect(first.token).toBeTruthy();

			const second = yield* userExTokenEnableFx({
				userId: user.id,
			});

			expect(typeof second.token).toBe("string");
			expect(second.token).not.toBe(first.token);

			const disabled = yield* userExTokenDisableFx({
				userId: user.id,
			});

			expect(disabled.token).toBeNull();

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("user_ex")
					.selectAll()
					.where("userId", "=", user.id)
					.execute(),
			);

			expect(rows).toHaveLength(1);
			expect(rows[0]?.token).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
