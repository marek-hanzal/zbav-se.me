import { withDatabase } from "@use-pico/common";
import { getMigrations } from "better-auth/db";
import { auth } from "../auth";
import type { Database } from "./Database";
import { dialect } from "./dialect";
import { migrations } from "./migrations";

/**
 * Don't destructure stuff as there is Proxy
 */
export const database = withDatabase<Database>({
	dialect,
	async onPreMigration() {
		return getMigrations(auth.options).then(({ runMigrations }) => {
			return runMigrations();
		});
	},
	async getMigrations() {
		return migrations;
	},
});
