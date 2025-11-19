import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import type { UserExPatchSchema } from "../schema/UserExPatchSchema";

export namespace userExPatchFx {
	export interface Props {
		data: UserExPatchSchema.Type;
	}
}

export const userExPatchFx = ({ data: { locationId, side } }: userExPatchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		yield* Effect.tryPromise(async () => {
			return database.transaction().execute(async (trx) => {
				try {
					const userEx = await trx
						.selectFrom("user_ex")
						.where("userId", "=", user.id)
						.selectAll()
						.executeTakeFirstOrThrow();

					await trx
						.updateTable("user_ex")
						.set({
							...userEx,
							locationId,
							side,
						})
						.where("id", "=", userEx.id)
						.execute();
				} catch {
					await trx
						.insertInto("user_ex")
						.values({
							id: genId(),
							userId: user.id,
							locationId,
							side,
						})
						.execute();
				}
			});
		});
	});
};

export type userExPatchFx = ReturnType<typeof userExPatchFx>;
