import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { userExTokenEnableFx } from "~/client/@user/user-ex/server/fx/userExTokenEnableFx";
import { UserExSchema } from "~/client/@user/user-ex/server/schema/UserExSchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const userExTokenEnableFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.handler(async ({ context: { database, user } }) => {
		return zodGuardFx({
			schema: UserExSchema,
			dataFx: userExTokenEnableFx({
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
