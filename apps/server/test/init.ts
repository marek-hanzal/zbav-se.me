import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPostgresTestDatabase } from "@zbav-se.me/test/postgres";
import { migrateZbavSeMeTemplateDatabase } from "@zbav-se.me/test/server";

type SetupResult = (() => Promise<void>) | void;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATABASE_BASE_URL = "postgresql://test:test@127.0.0.1:55432";

export default async function globalSetup(): Promise<SetupResult> {
	const setup = await withPostgresTestDatabase({
		containerName: "zbav-seme-test-postgres",
		image: "zbav-se.me:postgres",
		password: "test",
		port: 55432,
		repoRoot: path.resolve(HERE, "../../.."),
		templateDatabaseName: "test",
		user: "test",
		volumeName: "zbav-seme-test-postgres-data",
		async onTemplateReady({ templateDatabaseUrl }) {
			await migrateZbavSeMeTemplateDatabase(templateDatabaseUrl);
		},
	});

	process.env.SERVER_DATABASE_URL = DATABASE_BASE_URL;

	return async function onTeardown() {
		await setup.teardown();
	};
}
