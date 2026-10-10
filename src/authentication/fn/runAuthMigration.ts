import { getMigrations } from "better-auth/db/migration";
import type { Dialect } from "kysely";
import { auth } from "~/authentication/fn/auth";
import { translator } from "~/translation/fn/translator";

export const runAuthMigration = async (dialect: Dialect) => {
	const migrationTranslator = translator({
		translations: [],
	});

	const { options } = auth({
		dialect: () => dialect,
		translator: migrationTranslator,
	});

	return getMigrations(options).then(({ runMigrations }) => {
		return runMigrations();
	});
};
