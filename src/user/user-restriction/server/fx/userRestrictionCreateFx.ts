import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import type { UserRestrictionCreateSchema } from "../schema/UserRestrictionCreateSchema";

export namespace userRestrictionCreateFx {
	export interface Props extends UserRestrictionCreateSchema.Type {
		userId: string;
	}
}

export const userRestrictionCreateFx = Effect.fn("userRestrictionCreateFx")(function* ({
	userId,
	restriction,
	availableAt,
}: userRestrictionCreateFx.Props) {
	const logger = yield* getLoggerFx("userRestrictionCreateFx");
	logger.trace("userRestrictionCreateFx", {
		userId,
		restriction,
		availableAt,
	});

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;
	const id = genId();

	return yield* tryDbFx(async () =>
		kysely
			.insertInto("user_restriction")
			.values({
				id,
				userId,
				restriction,
				availableAt,
				createdAt: dateContext.now().toJSDate(),
			})
			.returning([
				"id",
				"createdAt",
				"restriction",
				"availableAt",
			])
			.executeTakeFirstOrThrow(),
	);
});

export type userRestrictionCreateFx = ReturnType<typeof userRestrictionCreateFx>;
