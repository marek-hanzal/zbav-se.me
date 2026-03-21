import path from "node:path";

const migrateScriptPath = path.resolve(
	import.meta.dir,
	"../../../../../apps/server/test/migrateTemplateDatabase.ts",
);

export async function migrateZbavSeMeTemplateDatabase(templateDatabaseUrl: string) {
	const proc = Bun.spawn({
		cmd: [
			"bun",
			migrateScriptPath,
		],
		env: {
			...process.env,
			SERVER_DATABASE_URL: templateDatabaseUrl,
		},
		stdout: "inherit",
		stderr: "inherit",
	});

	const exitCode = await proc.exited;

	if (exitCode !== 0) {
		throw new Error(`Failed to migrate zbav-se.me template database (exit ${exitCode})`);
	}
}
