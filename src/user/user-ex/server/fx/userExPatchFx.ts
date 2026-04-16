import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { ConflictErrorFx } from "~/server/error/ConflictErrorFx";
import type { UserExPatchSchema } from "~/user/user-ex/server/schema/UserExPatchSchema";

export namespace userExPatchFx {
	export interface Props extends UserExPatchSchema.Type {
		userId: string;
	}
}

export const userExPatchFx = Effect.fn("userExPatchFx")(function* ({
	userId,
	patch,
}: userExPatchFx.Props) {
	const logger = yield* getLoggerFx("userExPatchFx");
	logger.trace("userExPatchFx", {
		userId,
		patch,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const userEx = yield* tryDbFx(async () =>
				kysely
					.selectFrom("user_ex")
					.where("userId", "=", userId)
					.selectAll()
					.executeTakeFirst(),
			);

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

			return yield* tryDbFx(async () =>
				kysely
					.updateTable("user_ex")
					.set(patch)
					.where("id", "=", userEx.id)
					.returningAll()
					.executeTakeFirstOrThrow(),
			);
		}),
	);
});

export type userExPatchFx = ReturnType<typeof userExPatchFx>;
