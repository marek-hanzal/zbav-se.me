import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { auth } from "~/server/auth/auth";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";

const SEED_USER_PASSWORD = "12345678";

export namespace ensureSeedUserFx {
	export interface Props {
		email: string;
	}
}

export const ensureSeedUserFx = Effect.fn("ensureSeedUserFx")(function* ({
	email,
}: ensureSeedUserFx.Props) {
	const { kysely, dialect } = yield* KyselyContextFx;

	const current = yield* tryDbFx(async () => {
		return kysely.selectFrom("user").selectAll().where("email", "=", email).executeTakeFirst();
	});

	if (current) {
		return current;
	}

	const { api } = auth(() => dialect);

	yield* Effect.tryPromise({
		try: async () => {
			await api.signUpEmail({
				body: {
					email,
					name: `seed-${genId().slice(0, 8)}`,
					password: SEED_USER_PASSWORD,
				},
			});
		},
		catch: (cause) =>
			new RuntimeErrorFx({
				message: "Failed to create seed user via Better Auth",
				cause,
			}),
	});

	const created = yield* tryDbFx(async () => {
		return kysely.selectFrom("user").selectAll().where("email", "=", email).executeTakeFirst();
	});

	if (!created) {
		return yield* new RuntimeErrorFx({
			message: "Seed user was not found after Better Auth sign-up",
		});
	}

	return created;
});
