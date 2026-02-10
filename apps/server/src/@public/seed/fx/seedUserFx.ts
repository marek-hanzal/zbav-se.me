import { NotFoundErrorFx } from "@use-pico/common/error";
import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace seedUserFx {
	export interface Props {
		email: string;
	}
}

export const seedUserFx = Effect.fn("seedUserFx")(function* ({ email }: seedUserFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	const current = yield* tryDbFx(async () =>
		kysely.selectFrom("user").where("email", "=", email).selectAll().executeTakeFirst(),
	);

	if (!current) {
		yield* withTraceFx({
			fx: "seedUserFx",
			error: {
				resource: "user",
				resourceId: email,
				message: "User not found",
			},
		});
		return yield* new NotFoundErrorFx({
			resource: "user",
			resourceId: email,
			message: "User not found",
		});
	}

	return current;
});
