import { FileMigrationProvider, Migrator } from "kysely";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { db } from "./db";

const upgrade = async () => {
	const migrator = new Migrator({
		db,
		migrationLockTableName: "migration_lock",
		migrationTableName: "migration",
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder: path.join(__dirname, "./migration"),
		}),
	});

	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === "Success") {
			console.log(`migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === "Error") {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error("failed to migrate");
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
};

await upgrade();
