import { Effect } from "effect";
import { authFn } from "~/authentication/fn/authFn";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { dbFx } from "~/database/fx/dbFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import { RuntimeErrorFx } from "~/server-error/error/RuntimeErrorFx";
import { withTranslatorFx } from "~/translator/fx/withTranslatorFx";

const SEED_USER_PASSWORD = "12345678";

export namespace ensureSeedUserFx {
	export interface Props {
		email: string;
	}
}

export const ensureSeedUserFx = Effect.fn("ensureSeedUserFx")(function* ({
	email,
}: ensureSeedUserFx.Props) {
	const { dialect } = yield* KyselyContextFx;

	const current = yield* dbFx(async (kysely) => {
		return kysely.selectFrom("user").selectAll().where("email", "=", email).executeTakeFirst();
	});

	if (current) {
		return current;
	}

	const { api } = authFn({
		dialectFn: () => dialect,
		translator: yield* withTranslatorFx({
			locale: "cs",
		}),
	});

	yield* Effect.tryPromise({
		try: async () => {
			await api.signUpEmail({
				body: {
					email,
					name: `seed-${genIdFn().slice(0, 8)}`,
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

	const created = yield* dbFx(async (kysely) => {
		return kysely.selectFrom("user").selectAll().where("email", "=", email).executeTakeFirst();
	});

	if (!created) {
		return yield* new RuntimeErrorFx({
			message: "Seed user was not found after Better Auth sign-up",
		});
	}

	return created;
});
