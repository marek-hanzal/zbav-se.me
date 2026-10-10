import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { ConflictErrorFx } from "~/server-error/error/ConflictErrorFx";
import type { UserExPatchSchema } from "~/user-ex/schema/UserExPatchSchema";

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
								id: genIdFn(),
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
