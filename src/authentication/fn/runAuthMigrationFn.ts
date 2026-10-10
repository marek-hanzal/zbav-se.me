import { getMigrations } from "better-auth/db/migration";
import type { Dialect } from "kysely";
import { authFn } from "~/authentication/fn/authFn";
import { translatorFn } from "~/translation/fn/translatorFn";

export const runAuthMigrationFn = async (dialect: Dialect) => {
	const migrationTranslator = translatorFn({
		translations: [],
	});

	const { options } = authFn({
		dialectFn: () => dialect,
		translator: migrationTranslator,
	});

	return getMigrations(options).then(({ runMigrations: runMigrationsFn }) => {
		return runMigrationsFn();
	});
};
