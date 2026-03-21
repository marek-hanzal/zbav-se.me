import path from "node:path";
import { fileURLToPath } from "node:url";
import { DialectContextFx } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Client, Pool } from "pg";
import { database } from "~/database/kysely";

type SetupResult = (() => Promise<void>) | void;
type ContainerState = {
	image: string;
	running: boolean;
};

const IMAGE = "zbav-se.me:postgres";
const CONTAINER_NAME = "zbav-seme-test-postgres";

const DATABASE_PORT = 55432;
const DATABASE_URL = `postgresql://test:test@127.0.0.1:${DATABASE_PORT}`;
const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

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

function shOptional(cmd: string[]) {
	const proc = Bun.spawnSync({
		cmd,
		cwd: REPO_ROOT,
		stdout: "pipe",
		stderr: "pipe",
	});

	if (proc.exitCode !== 0) {
		return null;
	}

	return {
		stdout: new TextDecoder().decode(proc.stdout).trim(),
	};
}

function imageExists(image: string) {
	try {
		const { stdout } = sh(
			[
				"docker",
				"image",
				"inspect",
				image,
			],
			"",
		);

		return stdout.length > 0;
	} catch {
		return false;
	}
}

function sleep(ms: number) {
	return new Promise((r) => setTimeout(r, ms));
}

async function waitForPostgresConnect(dsn: string, timeoutMs = 10_000) {
	const started = Date.now();
	while (Date.now() - started < timeoutMs) {
		try {
			const client = new Client({
				connectionString: dsn,
				connectionTimeoutMillis: 1_000,
			});
			await client.connect();
			await client.query("select 1");
			await client.end();
			return;
		} catch {
			await sleep(100);
		}
	}
	throw new Error(`Postgres not accepting connections: ${dsn}`);
}

function inspectContainer(name: string): ContainerState | null {
	const result = shOptional([
		"docker",
		"inspect",
		name,
		"--format",
		"{{.Config.Image}}\t{{.State.Running}}",
	]);

	if (!result) {
		return null;
	}

	const [image = "", running = "false"] = result.stdout.split("\t");

	return {
		image,
		running: running === "true",
	};
}

async function ensurePostgresContainer() {
	const existing = inspectContainer(CONTAINER_NAME);

	if (existing?.running && existing.image === IMAGE) {
		await waitForPostgresConnect(`${DATABASE_URL}/test`);
		return;
	}

	if (existing) {
		shQuiet([
			"docker",
			"rm",
			"-f",
			CONTAINER_NAME,
		]);
	}

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

	await waitForPostgresConnect(`${DATABASE_URL}/test`);
}

export default async function globalSetup(): Promise<SetupResult> {
	sh(
		[
			"docker",
			"version",
		],
		"Docker is not available",
	);

	if (!imageExists(IMAGE)) {
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
	}

	await ensurePostgresContainer();

	process.env.SERVER_DATABASE_URL = DATABASE_URL;

	await Effect.gen(function* () {
		const { kysely, migrate } = yield* database;

		yield* Effect.promise(async () => migrate());

		yield* Effect.promise(async () => kysely.destroy());
	}).pipe(
		Effect.provideService(
			DialectContextFx,
			new PostgresDialect({
				pool: new Pool({
					connectionString: `${DATABASE_URL}/test`,
				}),
			}),
		),
		Effect.runPromise,
	);
}
