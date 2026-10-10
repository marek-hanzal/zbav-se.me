import { execFileSync, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { afterAll, beforeAll, expect, inject, it } from "vitest";
import { Pool } from "~/database/service/pg";

const directory = mkdtempSync(resolve(tmpdir(), "zbav-migration-test-"));
const entry = resolve(directory, "migrate.mjs");

beforeAll(() => {
	execFileSync(
		"vite",
		[
			"build",
			"--config",
			"vite.migration.config.ts",
			"--outDir",
			directory,
		],
		{
			stdio: "pipe",
			timeout: 30_000,
		},
	);
}, 30_000);

afterAll(() => {
	rmSync(directory, {
		recursive: true,
		force: true,
	});
});

it("runs the compiled migrator against a fresh database and safely repeats migrations and imports", async () => {
	const source = inject("testDatabaseDsn");
	const name = `migration_${randomUUID().replaceAll("-", "")}`;
	const admin = new Pool({
		connectionString: source,
		max: 1,
	});
	const connection = new URL(source);
	connection.pathname = `/${name}`;
	let database: Pool<any> | undefined;
	try {
		await admin.query(`CREATE DATABASE "${name}"`);
		database = new Pool({
			connectionString: connection.toString(),
			max: 1,
		});
		const runFn = () =>
			spawnSync(
				process.execPath,
				[
					entry,
				],
				{
					timeout: 30_000,
					encoding: "utf8",
					env: {
						...process.env,
						SERVER_DATABASE_URL: connection.toString(),
					},
				},
			);
		const first = runFn();
		expect(first.status, `${first.stdout}\n${first.stderr}`).toBe(0);
		const before = await database.query("SELECT name FROM kysely_migration ORDER BY name");
		expect(before.rows.length).toBeGreaterThan(0);
		const again = runFn();
		expect(again.status, `${again.stdout}\n${again.stderr}`).toBe(0);
		const after = await database.query("SELECT name FROM kysely_migration ORDER BY name");
		expect(after.rows).toEqual(before.rows);
		const translations = await database.query("SELECT count(*)::int AS count FROM translation");
		expect(translations.rows[0].count).toBeGreaterThan(0);
		const auth = await database.query("SELECT to_regclass('public.user') AS table");
		expect(auth.rows[0].table).toBe('"user"');
	} finally {
		await database?.end();
		await admin.query(`DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`);
		await admin.end();
	}
}, 60_000);

it("exits unsuccessfully without leaving a pool open when the database connection fails", () => {
	const connection = new URL(inject("testDatabaseDsn"));
	connection.pathname = `/missing_${randomUUID().replaceAll("-", "")}`;
	const result = spawnSync(
		process.execPath,
		[
			entry,
		],
		{
			timeout: 10_000,
			encoding: "utf8",
			env: {
				...process.env,
				SERVER_DATABASE_URL: connection.toString(),
			},
		},
	);
	expect(result.error).toBeUndefined();
	expect(result.status).toBe(1);
	expect(result.stderr).toContain("Database migration failed.");
});
