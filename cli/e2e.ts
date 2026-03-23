const config = {
	rootDir: new URL("../", import.meta.url).pathname,
	dotenvBin: new URL("../node_modules/.bin/dotenv", import.meta.url).pathname,
	directories: {
		app: new URL("../apps/app", import.meta.url).pathname,
		server: new URL("../apps/server", import.meta.url).pathname,
		e2e: new URL("../apps/e2e", import.meta.url).pathname,
	},
	postgres: {
		image: "nhost/postgres:17-20260320-1",
		container: "zbav-seme-e2e-postgres",
		volume: "zbav-seme-e2e-postgres-data",
		host: "127.0.0.1",
		port: 56432,
		user: "postgres",
		password: "e2e",
		seedDatabase: "e2e_seed",
		testDatabase: "e2e",
	},
	urls: {
		app: "http://zbav-se.me.localhost:1355",
		api: "http://api.zbav-se.me.localhost:1355",
	},
	timeouts: {
		ready: 120_000,
		stop: 250,
		short: 15_000,
		migration: 30_000,
	},
	previews: [
		{
			name: "server-preview",
			cwd: new URL("../apps/server", import.meta.url).pathname,
			cmd: [
				"portless",
				"--force",
				"api.zbav-se.me",
				"node",
				".output/server/index.mjs",
			],
		},
		{
			name: "app-preview",
			cwd: new URL("../apps/app", import.meta.url).pathname,
			cmd: [
				"portless",
				"--force",
				"zbav-se.me",
				"node",
				".output/server/index.mjs",
			],
		},
	],
	builds: [
		{
			name: "preview server",
			cwd: new URL("../apps/server", import.meta.url).pathname,
		},
		{
			name: "preview app",
			cwd: new URL("../apps/app", import.meta.url).pathname,
		},
	],
};

type Spawned = ReturnType<typeof Bun.spawn>;
type PreviewProcess = {
	name: string;
	proc: Spawned;
};
type CmdOptions = {
	cwd?: string;
	env?: NodeJS.ProcessEnv;
};

const databaseHostUrl = `postgresql://${config.postgres.user}:${config.postgres.password}@${config.postgres.host}:${config.postgres.port}`;
const databaseUrl = `${databaseHostUrl}/${config.postgres.testDatabase}`;

let previews: PreviewProcess[] = [];
let cleaningUp = false;

function decode(stream?: Uint8Array<ArrayBufferLike> | null) {
	return stream ? new TextDecoder().decode(stream).trim() : "";
}

function exec(cmd: string[], options: CmdOptions = {}) {
	const proc = Bun.spawnSync({
		cmd,
		cwd: options.cwd ?? config.rootDir,
		env: options.env ?? process.env,
		stdout: "pipe",
		stderr: "pipe",
	});

	return {
		exitCode: proc.exitCode,
		stdout: decode(proc.stdout),
		stderr: decode(proc.stderr),
	};
}

function run(cmd: string[], hint: string, options: CmdOptions = {}) {
	const result = exec(cmd, options);

	if (result.exitCode !== 0) {
		throw new Error(
			[
				hint,
				result.stderr,
				result.stdout,
			]
				.filter(Boolean)
				.join("\n\n"),
		);
	}

	return result;
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retry(fn: () => Promise<boolean> | boolean, timeoutMs: number, hint: string, delayMs = 100) {
	const startedAt = Date.now();

	while (Date.now() - startedAt < timeoutMs) {
		if (await fn()) {
			return;
		}

		await sleep(delayMs);
	}

	throw new Error(hint);
}

function dockerExec(...args: string[]) {
	return exec([
		"docker",
		"exec",
		config.postgres.container,
		...args,
	]);
}

function psql(database: string, sql: string, hint: string) {
	run(
		[
			"docker",
			"exec",
			config.postgres.container,
			"psql",
			"-U",
			config.postgres.user,
			"-d",
			database,
			"-c",
			sql,
		],
		hint,
	);
}

async function readStream(stream: ReadableStream<Uint8Array> | null | undefined) {
	return stream ? (await new Response(stream).text()).trim() : "";
}

async function waitForExit(proc: Spawned, timeoutMs: number) {
	return await Promise.race([
		proc.exited.then(() => true),
		sleep(timeoutMs).then(() => false),
	]);
}

async function previewLogs() {
	const logs = await Promise.all(
		previews.map(async ({ name, proc }) => {
			const output = [
				await readStream(proc.stderr),
				await readStream(proc.stdout),
			]
				.filter(Boolean)
				.join("\n\n");

			return output
				? [
						`[${name}]`,
						output,
					].join("\n")
				: "";
		}),
	);

	return logs.filter(Boolean).join("\n\n");
}

function e2eEnv(): NodeJS.ProcessEnv {
	return {
		...process.env,
		SERVER_DATABASE_URL: databaseUrl,
		VITE_ORIGIN: config.urls.app,
		VITE_SERVER_API: config.urls.api,
		VITE_APP_ASSETS: "/",
		E2E_APP_URL: config.urls.app,
		E2E_API_URL: config.urls.api,
	};
}

async function waitForPostgres() {
	await retry(
		() =>
			dockerExec(
				"pg_isready",
				"-U",
				config.postgres.user,
				"-d",
				config.postgres.seedDatabase,
			).stdout.includes("accepting connections"),
		config.timeouts.short,
		"E2E Postgres container did not become ready in time",
	);
}

async function waitForDatabase(database: string) {
	await retry(
		() =>
			dockerExec(
				"psql",
				"-U",
				config.postgres.user,
				"-d",
				database,
				"-c",
				"SELECT 1;",
			).stdout.includes("1 row"),
		config.timeouts.short,
		`Database "${database}" did not become ready in time`,
	);
}

function resetDatabase() {
	psql(
		config.postgres.seedDatabase,
		[
			"SELECT pg_terminate_backend(pid)",
			"FROM pg_stat_activity",
			`WHERE datname = '${config.postgres.testDatabase}'`,
			"AND pid <> pg_backend_pid();",
		].join(" "),
		"Failed to terminate existing E2E database connections",
	);
	psql(
		config.postgres.seedDatabase,
		`DROP DATABASE IF EXISTS ${config.postgres.testDatabase};`,
		"Failed to drop the E2E database",
	);
	psql(
		config.postgres.seedDatabase,
		`CREATE DATABASE ${config.postgres.testDatabase} OWNER ${config.postgres.user};`,
		"Failed to create the E2E database",
	);
}

async function waitForHttp(url: string, hint: string) {
	await retry(
		() =>
			exec([
				"curl",
				"-fsS",
				"-o",
				"/dev/null",
				"-L",
				url,
			]).exitCode === 0,
		config.timeouts.ready,
		hint,
		250,
	);
}

async function runMigration(env: NodeJS.ProcessEnv) {
	let lastError = "Unknown migration error";

	await retry(
		() => {
			const result = exec(
				[
					"curl",
					"-sS",
					"-X",
					"POST",
					"-w",
					"\\n%{http_code}",
					`${config.urls.api}/api/public/migration/run`,
				],
				{
					env,
				},
			);
			const lines = result.stdout.split("\n");
			const status = lines.pop()?.trim();
			const body = lines.join("\n").trim();

			if (result.exitCode === 0 && status === "200") {
				return true;
			}

			lastError = [
				result.stderr,
				body,
				status ? `HTTP ${status}` : "",
			]
				.filter(Boolean)
				.join("\n\n");

			return false;
		},
		config.timeouts.migration,
		[
			"Failed to run server migrations for the E2E database",
			lastError,
		]
			.filter(Boolean)
			.join("\n\n"),
		250,
	);
}

function buildPreviewApps(env: NodeJS.ProcessEnv) {
	for (const build of config.builds) {
		run(
			[
				config.dotenvBin,
				"-c",
				"development",
				"--",
				"bun",
				"run",
				"build:preview",
			],
			`Failed to build the ${build.name}`,
			{
				cwd: build.cwd,
				env,
			},
		);
	}
}

function startPreviewApps(env: NodeJS.ProcessEnv) {
	previews = config.previews.map((preview) => ({
		name: preview.name,
		proc: Bun.spawn(
			[
				config.dotenvBin,
				"-c",
				"development",
				"--",
				...preview.cmd,
			],
			{
				cwd: preview.cwd,
				detached: true,
				env,
				stdout: "pipe",
				stderr: "pipe",
			},
		),
	}));
}

async function stopPreviewApps() {
	const running = previews;
	previews = [];

	for (const { proc } of running) {
		try {
			process.kill(-proc.pid, "SIGKILL");
		} catch {
			try {
				proc.kill("SIGKILL");
			} catch {
				//
			}
		}

		await waitForExit(proc, config.timeouts.stop);

		try {
			await proc.stdout?.cancel();
			await proc.stderr?.cancel();
		} catch {
			//
		}
	}
}

async function cleanup() {
	if (cleaningUp) {
		return;
	}

	cleaningUp = true;
	await stopPreviewApps();
	exec([
		"docker",
		"rm",
		"-f",
		config.postgres.container,
	]);
}

async function main() {
	const env = e2eEnv();

	try {
		run([
			"docker",
			"version",
		], "Docker is not available");
		exec([
			"docker",
			"volume",
			"rm",
			"-f",
			config.postgres.volume,
		]);
		run(
			[
				"docker",
				"volume",
				"create",
				config.postgres.volume,
			],
			"Failed to create the dedicated E2E Docker volume",
		);
		exec([
			"docker",
			"rm",
			"-f",
			config.postgres.container,
		]);
		run(
			[
				"docker",
				"run",
				"-d",
				"--name",
				config.postgres.container,
				"--restart",
				"unless-stopped",
				"-v",
				`${config.postgres.volume}:/var/lib/postgresql/data`,
				"-e",
				`POSTGRES_USER=${config.postgres.user}`,
				"-e",
				`POSTGRES_PASSWORD=${config.postgres.password}`,
				"-e",
				`POSTGRES_DB=${config.postgres.seedDatabase}`,
				"-p",
				`${config.postgres.host}:${config.postgres.port}:5432`,
				config.postgres.image,
			],
			"Failed to start the dedicated E2E Postgres container",
		);

		await waitForPostgres();
		await waitForDatabase(config.postgres.seedDatabase);
		resetDatabase();
		await waitForDatabase(config.postgres.testDatabase);
		buildPreviewApps(env);
		startPreviewApps(env);
		await waitForHttp(`${config.urls.api}/api/public/health`, "Preview API did not become ready in time");
		await runMigration(env);
		await waitForHttp(config.urls.app, "Preview app did not become ready in time");

		const tests = Bun.spawnSync({
			cmd: [
				"bun",
				"run",
				"e2e",
			],
			cwd: config.directories.e2e,
			env,
			stdout: "inherit",
			stderr: "inherit",
		});

		if (tests.exitCode !== 0) {
			process.exitCode = tests.exitCode;
		}
	} catch (error) {
		const logs = await previewLogs();

		console.error(
			[
				error instanceof Error ? error.message : String(error),
				logs ? `Preview logs:\n${logs}` : "",
			]
				.filter(Boolean)
				.join("\n\n"),
		);
		process.exitCode = 1;
	} finally {
		await cleanup();
	}
}

await main();
