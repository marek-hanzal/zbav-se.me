import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
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
			const userEx = yield* dbFx(async (kysely) => {
				return kysely
					.selectFrom("user_ex")
					.where("userId", "=", userId)
					.selectAll()
					.executeTakeFirst();
			});

			if (!userEx) {
				return yield* dbFx(
					async (kysely) => {
						return kysely
							.insertInto("user_ex")
							.values({
								id: genId(),
								userId,
								...patch,
							})
							.returningAll()
							.executeTakeFirstOrThrow();
					},
					{
						"23505": (e) =>
							new ConflictErrorFx({
								message: "User ex already exists",
								cause: e,
							}),
					},
				);
			}

			return yield* dbFx(async (kysely) => {
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
