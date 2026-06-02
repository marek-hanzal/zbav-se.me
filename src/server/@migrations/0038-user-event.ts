import { sql } from "kysely";
import type { Migration } from "kysely/migration";
import { toEnumGuard } from "@/lib/common/to-enum-guard";
import type { UserEventScopeEnumSchema } from "~/common/user-event/enum/UserEventScopeEnumSchema";

export const UserEventMigration: Migration = {
	async up(db) {
		await db.schema
			.createType("user_event_scope_enum")
			.asEnum(
				toEnumGuard<UserEventScopeEnumSchema.Type>()([
					"user",
					"foreign",
				] as const),
			)
			.execute();

		await db.schema
			.createTable("user_event")
			.addColumn("id", "text", (col) => col.primaryKey().notNull())
			//
			.addColumn("userId", "text", (col) => col.notNull())
			.addColumn("scope", sql`user_event_scope_enum`, (col) => col.notNull())
			.addColumn("source", "text", (col) => col.notNull())
			.addColumn("event", "text", (col) => col.notNull())
			.addColumn("group", "text", (col) => col.notNull())
			.addColumn("isTerminal", "boolean", (col) => col.notNull())
			//
			.addColumn("createdAt", "timestamptz", (col) => col.notNull())
			//
			.addForeignKeyConstraint(
				"user_event_[userId]_fk",
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
            CREATE INDEX "user_event_[userId-createdAt]_idx" ON "user_event" ("userId", "createdAt" DESC);
        `.execute(db);

		await sql`
            CREATE INDEX "user_event_[userId-source-event-createdAt]_idx" ON "user_event" ("userId", "source", "event", "createdAt" DESC);
        `.execute(db);

		await sql`
            CREATE INDEX "user_event_[userId-group-createdAt]_idx" ON "user_event" ("userId", "group", "createdAt" DESC);
        `.execute(db);

		await sql`
            CREATE INDEX "user_event_[createdAt]_idx" ON "user_event" ("createdAt" DESC);
        `.execute(db);

        await sql`
            CREATE INDEX user_event_[createdAt-id]_idx
            ON user_event ("createdAt", id);
        `.execute(db);
	},
};
