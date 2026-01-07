import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { UserExPatchSchema } from "~/app/user-ex/schema/UserExPatchSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const userEx = yield* Effect.tryPromise(async () => {
				return database
					.selectFrom("user_ex")
					.where("userId", "=", userId)
					.selectAll()
					.executeTakeFirst();
			});

			if (!userEx) {
				return yield* Effect.promise(async () => {
					return database
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
				return database
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
