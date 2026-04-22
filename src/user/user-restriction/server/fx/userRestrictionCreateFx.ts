import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { UserRestrictionContextFx } from "../context/UserRestrictionContextFx";
import type { UserRestrictionCreateSchema } from "../schema/UserRestrictionCreateSchema";

export namespace userRestrictionCreateFx {
	export interface Props extends UserRestrictionCreateSchema.Type {
		userId: string;
	}
}

export const userRestrictionCreateFx = Effect.fn("userRestrictionCreateFx")(function* ({
	userId,
	restriction,
}: userRestrictionCreateFx.Props) {
	const userRestrictionContext = yield* UserRestrictionContextFx;
	const dateContext = yield* DateContextFx;

	const logger = yield* getLoggerFx("userRestrictionCreateFx");
	logger.trace("userRestrictionCreateFx", {
		userId,
		restriction,
	});

	const delay = userRestrictionContext.delay[restriction] ?? 0;
	const availableAt = dateContext
		.now()
		.plus({
			hours: delay,
		})
		.toJSDate();

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();
			const createdAt = dateContext.now().toJSDate();
			const isAvailable = availableAt.getTime() <= createdAt.getTime();

			yield* Effect.promise(async () => {
				/**
				 * The rule:
				 * - if we've to wait, discard only future waiting restrictions
				 * - if we're not waiting, discard _all_ restrictions as the new one replaces them
				 */
				await kysely
					.updateTable("user_restriction")
					.set({
						expiresAt: dateContext.now().toJSDate(),
					})
					.$if(delay > 0, (eb) => {
						return eb.where("availableAt", ">", dateContext.now().toJSDate());
					})
					.where("userId", "=", userId)
					.execute();

				/**
				 * If we're waiting, set expiration date on current restriction(s) to
				 * available date of the new one, so they'll flip properly
				 */
				if (delay > 0) {
					await kysely
						.updateTable("user_restriction")
						.set({
							expiresAt: availableAt,
						})
						.where("availableAt", "<=", dateContext.now().toJSDate())
						.where("userId", "=", userId)
						.execute();
				}
			});

			return yield* tryDbFx(async () => {
				await kysely
					.insertInto("user_restriction")
					.values({
						id,
						userId,
						restriction,
						availableAt,
						expiresAt: null,
						createdAt,
					})
					.execute();

				return {
					id,
					userId,
					restriction,
					availableAt,
					expiresAt: null,
					createdAt,
					isAvailable,
				} as const;
			});
		}),
	);
});

export type userRestrictionCreateFx = ReturnType<typeof userRestrictionCreateFx>;
