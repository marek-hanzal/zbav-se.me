import { toEnumGuard } from "@use-pico/common/to-enum-guard";
import { type Migration, sql } from "kysely";
import type { UserSideEnumSchema } from "~/server/database/@enum/UserSideEnumSchema";

export const UserExMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("user_ex_side_enum")
			.asEnum(
				toEnumGuard<UserSideEnumSchema.Type>()([
					"seller",
					"buyer",
				] as const),
			)
			.execute();

		await db.schema
			.createTable("user_ex")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			.addColumn("userId", "text", (col) => col.notNull().unique())
			.addColumn("locationId", "text")
			.addColumn("side", sql`user_ex_side_enum`)
			.addColumn("token", "text")
			.addForeignKeyConstraint(
				"user_ex_[userId]_fk",
				[
					"userId",
				],
				"user",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addForeignKeyConstraint(
				"user_ex_[locationId]_fk",
				[
					"locationId",
				],
				"location",
				[
					"id",
				],
				(c) => c.onDelete("cascade"),
			)
			.addUniqueConstraint("user_ex_[userId]_unique_idx", [
				"userId",
			])
			.execute();

		await db.schema
			.createIndex("user_ex_[locationId]_idx")
			.on("user_ex")
			.column("locationId")
			.execute();

		await sql`
			CREATE UNIQUE INDEX "user_ex_[token]_unique_idx"
			ON user_ex (token)
			WHERE token IS NOT NULL
		`.execute(db);
	},
};
