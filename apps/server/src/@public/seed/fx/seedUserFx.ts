import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace seedUserFx {
	export interface Props {
		email: string;
	}
}

export const seedUserFx = ({ email }: seedUserFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const current = yield* Effect.tryPromise(async () => {
			return database
				.selectFrom("user")
				.where("email", "=", email)
				.selectAll()
				.executeTakeFirst();
		});

		if (!current) {
			return yield* new NotFoundError({
				resource: "user",
				resourceId: email,
				message: "User not found",
			});
		}

		return current;
	});
};
