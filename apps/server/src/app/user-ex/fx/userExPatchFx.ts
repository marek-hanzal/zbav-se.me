import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { UserExPatchSchema } from "~/app/user-ex/schema/UserExPatchSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

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

			const userEx = yield* Effect.tryPromise(async () => {
				return kysely
					.selectFrom("user_ex")
					.where("userId", "=", userId)
					.selectAll()
					.executeTakeFirst();
			});

			if (!userEx) {
				return yield* Effect.promise(async () => {
					return kysely
						.insertInto("user_ex")
						.values({
							id: genId(),
							userId,
							...patch,
						})
						.returningAll()
						.executeTakeFirstOrThrow();
				});
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
