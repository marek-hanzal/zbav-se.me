import { NotFoundErrorFx } from "@use-pico/common/error";
import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace seedUserFx {
	export interface Props {
		email: string;
	}
}

export const seedUserFx = Effect.fn("seedUserFx")(function* ({ email }: seedUserFx.Props) {
	const database = yield* DatabaseContextFx;

	const current = yield* Effect.promise(async () => {
		return database
			.selectFrom("user")
			.where("email", "=", email)
			.selectAll()
			.executeTakeFirst();
	});

	if (!current) {
		return yield* new NotFoundErrorFx({
			resource: "user",
			resourceId: email,
			message: "User not found",
		});
	}

	return current;
});
