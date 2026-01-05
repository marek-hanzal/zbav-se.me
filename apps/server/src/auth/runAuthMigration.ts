import { getMigrations } from "better-auth/db";
import type { Dialect } from "kysely";
import { auth } from "./auth";

export const runAuthMigration = async (dialect: () => Promise<Dialect>) => {
	const { options } = await auth(dialect);

	return getMigrations(options).then(({ runMigrations }) => {
		return runMigrations();
	});
};
