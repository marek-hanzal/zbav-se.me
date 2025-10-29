import { getMigrations } from "better-auth/db";
import { auth } from "./auth";

export const runAuthMigration = async () => {
	return getMigrations(auth.options).then(({ runMigrations }) => {
		return runMigrations();
	});
};
