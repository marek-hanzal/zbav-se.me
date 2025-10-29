import type { Migration } from "kysely";
import { sql } from "kysely";

export const UserExSideMigration: Migration = {
	async up(db) {
		// Create the enum type
		await db.schema
			.createType("user_side")
			.asEnum([
				"seller",
				"buyer",
			])
			.execute();

		await db.schema
			.alterTable("user_ex")
			.addColumn("side", sql`user_side`, (col) => col)
			.execute();
	},
};
