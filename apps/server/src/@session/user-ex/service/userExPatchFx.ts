import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import type { UserExPatchSchema } from "../schema/UserExPatchSchema";

export namespace userExPatchFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		data: UserExPatchSchema.Type;
	}
}

export const userExPatchFx = ({
	database,
	userId,
	data: { locationId, side },
}: userExPatchFx.Props) => {
	return Effect.gen(function* () {
		yield* Effect.promise(async () => {
			return database.transaction().execute(async (trx) => {
				try {
					const userEx = await trx
						.selectFrom("user_ex")
						.where("userId", "=", userId)
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
							userId,
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
