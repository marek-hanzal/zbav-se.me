import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/schema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { userExTokenDisableFx } from "~/user/user-ex/server/fx/userExTokenDisableFx";
import { UserExSchema } from "~/user/user-ex/server/schema/UserExSchema";

export const userExTokenDisableFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.handler(async ({ context: { database, user } }) => {
		return zodGuardFx({
			schema: UserExSchema,
			dataFx: userExTokenDisableFx({
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				ConflictErrorFx() {
					throw new Error("ConflictError");
				},
				RuntimeErrorFx() {
					throw new Error("RuntimeError");
				},
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
