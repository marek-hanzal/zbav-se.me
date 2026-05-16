import { getMigrations } from "better-auth/db/migration";
import type { Dialect } from "kysely";
import { auth } from "~/server/auth/auth";
import { withTranslator } from "~/translator/server/withTranslator";

export const runAuthMigration = async (dialect: Dialect) => {
	const { options } = auth({
		dialect: () => dialect,
		translator: await withTranslator("migration"),
	});

	return getMigrations(options).then(({ runMigrations }) => {
		return runMigrations();
	});
};
