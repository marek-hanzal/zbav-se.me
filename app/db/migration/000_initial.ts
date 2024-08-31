import type { Kysely } from "kysely";

export const up = async (db: Kysely<any>): Promise<void> => {
	db.schema
		.createTable("user")
		.addColumn("id", "char(24)", (col) => col.primaryKey())
		.addColumn("name", "varchar(128)", (col) => col.notNull())
		.addColumn("email", "varchar(128)", (col) => col.notNull().unique())
		.execute();
};
