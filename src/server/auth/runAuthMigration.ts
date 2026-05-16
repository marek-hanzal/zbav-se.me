import { getMigrations } from "better-auth/db/migration";
import type { Dialect } from "kysely";
import { auth } from "~/server/auth/auth";

export const runAuthMigration = async (dialect: Dialect) => {
	const { options } = auth({
		dialect: () => dialect,
		locale: "migration",
	});

	return getMigrations(options).then(({ runMigrations }) => {
		return runMigrations();
	});
};
