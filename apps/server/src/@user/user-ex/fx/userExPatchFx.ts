import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { UserExPatchSchema } from "~/@user/user-ex/schema/UserExPatchSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace userExPatchFx {
	export type Props = UserExPatchSchema.Type;
}

export const userExPatchFx = ({ patch }: userExPatchFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			const userEx = yield* Effect.tryPromise(async () => {
				return database
					.selectFrom("user_ex")
					.where("userId", "=", user.id)
					.selectAll()
					.executeTakeFirst();
			});

			if (!userEx) {
				return yield* Effect.tryPromise(async () => {
					return database
						.insertInto("user_ex")
						.values({
							id: genId(),
							userId: user.id,
							...patch,
						})
						.returningAll()
						.executeTakeFirstOrThrow();
				});
			}

			return yield* Effect.tryPromise(async () => {
				return database
					.updateTable("user_ex")
					.set(patch)
					.where("id", "=", userEx.id)
					.executeTakeFirstOrThrow();
			});
		}),
	);
};

export type userExPatchFx = ReturnType<typeof userExPatchFx>;
