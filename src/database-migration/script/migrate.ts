import { runMigrationFn } from "~/database-migration/fn/runMigrationFn";

try {
	await runMigrationFn();
	console.info("Database migrations and imports completed.");
} catch (error) {
	console.error(
		"Database migration failed.",
		error instanceof Error ? error.message : "Unknown error",
	);
	process.exitCode = 1;
}
