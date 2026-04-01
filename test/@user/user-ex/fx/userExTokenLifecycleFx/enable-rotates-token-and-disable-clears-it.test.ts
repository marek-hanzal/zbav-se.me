import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { userExTokenDisableFx } from "~/user/user-ex/server/fx/userExTokenDisableFx";
import { userExTokenEnableFx } from "~/user/user-ex/server/fx/userExTokenEnableFx";

describe("userEx token lifecycle", () => {
	it("enables, rotates and disables token for a user", async () => {
		const database = await testabase("userExTokenLifecycle");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "user-ex-token@test.cz",
						name: "User Ex Token",
						password: "12345678",
					},
				}),
			);

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
