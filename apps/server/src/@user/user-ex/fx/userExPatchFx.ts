import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { UserExPatchSchema } from "../schema/UserExPatchSchema";

export namespace userExPatchFx {
	export interface Props {
		data: UserExPatchSchema.Type;
	}
}

export const userExPatchFx = ({ data }: userExPatchFx.Props) => {
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
							...data,
						})
						.returningAll()
						.executeTakeFirstOrThrow();
				});
			}

			return yield* Effect.tryPromise(async () => {
				return database
					.updateTable("user_ex")
					.set({
						...userEx,
						...data,
					})
					.where("id", "=", userEx.id)
					.returningAll()
					.executeTakeFirstOrThrow();
			});
		}),
	);
};

export type userExPatchFx = ReturnType<typeof userExPatchFx>;
