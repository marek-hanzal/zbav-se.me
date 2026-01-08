import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DialectContextLayer } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Client, Pool } from "pg";
import { database } from "~/database/kysely";

const HERE = path.dirname(fileURLToPath(import.meta.url));

type SetupResult = (() => Promise<void>) | void;

const IMAGE = "zbav-se.me:postgres";
const CONTAINER_NAME = "zbav-seme-test-postgres";

const DATABASE_PORT = 55432;
const DATABASE_URL = `postgresql://test:test@127.0.0.1:${DATABASE_PORT}`;
const REPO_ROOT = path.resolve(HERE, "../../..");

function sh(cmd: string[], hint: string) {
	const proc = Bun.spawnSync({
		cmd,
		cwd: REPO_ROOT,
		stdout: "pipe",
		stderr: "pipe",
	});
	const stdout = new TextDecoder().decode(proc.stdout).trim();
	const stderr = new TextDecoder().decode(proc.stderr).trim();
	if (proc.exitCode !== 0) {
		throw new Error(`${hint}\n${stderr}`.trim());
	}
	return {
		stdout,
	};
}

function shQuiet(cmd: string[]) {
	Bun.spawnSync({
		cmd,
		cwd: REPO_ROOT,
		stdout: "ignore",
		stderr: "ignore",
	});
}

function sleep(ms: number) {
	return new Promise((r) => setTimeout(r, ms));
}

async function waitForTcp(host: string, port: number, timeoutMs = 20_000) {
	const started = Date.now();
	while (Date.now() - started < timeoutMs) {
		const ok = await new Promise<boolean>((resolve) => {
			const socket = net.connect({
				host,
				port,
			});
			socket.once("connect", () => {
				socket.end();
				resolve(true);
			});
			socket.once("error", () => resolve(false));
		});
		if (ok) {
			return;
		}
		await sleep(150);
	}
	throw new Error(`Postgres TCP not reachable on ${host}:${port}`);
}

async function waitForPostgresConnect(dsn: string, timeoutMs = 30_000) {
	const started = Date.now();
	while (Date.now() - started < timeoutMs) {
		try {
			const client = new Client({
				connectionString: dsn,
			});
			await client.connect();
			await client.query("select 1");
			await client.end();
			return;
		} catch {
			await sleep(250);
		}
	}
	throw new Error(`Postgres not accepting connections: ${dsn}`);
}

export default async function globalSetup(): Promise<SetupResult> {
	sh(
		[
			"docker",
			"version",
		],
		"Docker is not available",
	);

	sh(
		[
			"docker",
			"build",
			"--platform=linux/amd64",
			"-t",
			IMAGE,
			".",
		],
		`Failed to build image "${IMAGE}"`,
	);

	shQuiet([
		"docker",
		"rm",
		"-f",
		CONTAINER_NAME,
	]);

	sh(
		[
			"docker",
			"run",
			"-d",
			"--name",
			CONTAINER_NAME,
			"--rm",
			"-e",
			"POSTGRES_USER=test",
			"-e",
			"POSTGRES_PASSWORD=test",
			"-e",
			"POSTGRES_DB=test",
			"-p",
			`127.0.0.1:${DATABASE_PORT}:5432`,
			IMAGE,
		],
		"Failed to start Postgres container (port busy?)",
	);

	await waitForTcp("127.0.0.1", DATABASE_PORT);
	await waitForPostgresConnect(`${DATABASE_URL}/test`);

	process.env.SERVER_DATABASE_URL = DATABASE_URL;

	await Effect.gen(function* () {
		const { kysely, migrate } = yield* database;

		yield* Effect.promise(async () => migrate());

		yield* Effect.promise(async () => kysely.destroy());
	}).pipe(
		Effect.provide(
			DialectContextLayer(
				new PostgresDialect({
					pool: new Pool({
						connectionString: `${DATABASE_URL}/test`,
					}),
				}),
			),
		),
		Effect.runPromise,
	);
}
