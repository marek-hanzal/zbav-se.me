import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPostgresTestDatabase } from "@zbav-se.me/test/postgres";
import { migrateZbavSeMeTemplateDatabase } from "@zbav-se.me/test/server";
import {
	APP_ORIGIN,
	APP_PORT,
	DATABASE_CONTAINER_NAME,
	DATABASE_PORT,
	DATABASE_VOLUME_NAME,
	SERVER_PORT,
	WEB_ORIGIN,
	WEB_PORT,
} from "./config";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "../..");

const databaseId = `e2e_${Date.now()}_${process.pid}`;
const setup = await withPostgresTestDatabase({
	containerName: DATABASE_CONTAINER_NAME,
	image: "zbav-se.me:postgres",
	password: "test",
	port: DATABASE_PORT,
	repoRoot: REPO_ROOT,
	templateDatabaseName: "test",
	user: "test",
	volumeName: DATABASE_VOLUME_NAME,
	async onTemplateReady({ templateDatabaseUrl }) {
		await migrateZbavSeMeTemplateDatabase(templateDatabaseUrl);
	},
});
const clonedDatabase = await setup.cloneDatabase(databaseId);

const previewProc = Bun.spawn(
	[
		"bun",
		"x",
		"turbo",
		"run",
		"preview",
		"--parallel",
	],
	{
		cwd: REPO_ROOT,
		env: {
			...process.env,
			APP_PORT: String(APP_PORT),
			SERVER_DATABASE_URL: clonedDatabase.databaseUrl,
			SERVER_PORT: String(SERVER_PORT),
			VITE_APP_ORIGIN: APP_ORIGIN,
			VITE_WEB_ORIGIN: WEB_ORIGIN,
			WEB_PORT: String(WEB_PORT),
		},
		stdout: "inherit",
		stderr: "inherit",
	},
);

let cleaningUp = false;

const cleanup = async () => {
	if (cleaningUp) {
		return;
	}

	cleaningUp = true;

	previewProc.kill("SIGINT");
	await previewProc.exited.catch(() => undefined);
	await clonedDatabase.drop().catch(() => undefined);
	await setup.teardown().catch(() => undefined);
};

process.on("SIGINT", () => {
	void cleanup().finally(() => process.exit(130));
});

process.on("SIGTERM", () => {
	void cleanup().finally(() => process.exit(143));
});

const exitCode = await previewProc.exited;

await clonedDatabase.drop();
await setup.teardown();

process.exit(exitCode);
