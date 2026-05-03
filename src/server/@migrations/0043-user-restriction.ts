import { type Migration, sql } from "kysely";

export const UserRestrictionMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("user_restriction")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			.addColumn("restriction", sql`restriction_enum`, (col) => col.notNull())
			.addColumn("availableAt", "timestamptz", (col) => col.notNull())
			.addColumn("expiresAt", "timestamptz")
			.addForeignKeyConstraint(
				"user_restriction_[userId]_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.execute();

		await sql`
			CREATE INDEX "user_restriction_[userId-availableAt-expiresAt]_idx"
			ON "user_restriction" ("userId", "availableAt" DESC, "expiresAt");
		`.execute(db);

		await sql`
			CREATE INDEX "user_restriction_[userId-createdAt]_idx"
			ON "user_restriction" ("userId", "createdAt" DESC);
		`.execute(db);
	},
};
