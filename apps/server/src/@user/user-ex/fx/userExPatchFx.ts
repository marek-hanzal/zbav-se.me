import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { UserExPatchSchema } from "~/@user/user-ex/schema/UserExPatchSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { ConflictErrorFx } from "~/error/ConflictErrorFx";

export namespace userExPatchFx {
	export interface Props extends UserExPatchSchema.Type {
		userId: string;
	}
}

export const userExPatchFx = Effect.fn("userExPatchFx")(function* ({
	userId,
	patch,
}: userExPatchFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const userEx = yield* Effect.promise(async () => {
				return kysely
					.selectFrom("user_ex")
					.where("userId", "=", userId)
					.selectAll()
					.executeTakeFirst();
			});

			if (!userEx) {
				return yield* tryDbFx(
					async () =>
						kysely
							.insertInto("user_ex")
							.values({
								id: genId(),
								userId,
								...patch,
							})
							.returningAll()
							.executeTakeFirstOrThrow(),
					{
						"23505": (e) =>
							new ConflictErrorFx({
								message: "User ex already exists",
								cause: e,
							}),
					},
				);
			}

			return yield* Effect.promise(async () => {
				return kysely
					.updateTable("user_ex")
					.set(patch)
					.where("id", "=", userEx.id)
					.returningAll()
					.executeTakeFirstOrThrow();
			});
		}),
	);
});

export type userExPatchFx = ReturnType<typeof userExPatchFx>;
