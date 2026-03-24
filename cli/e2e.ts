function run(cmd: string[], hint: string, options: CmdOptions = {}) {
	return sh(cmd, hint, options);
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retry(
	fn: () => Promise<boolean> | boolean,
	timeoutMs: number,
	hint: string,
	delayMs = 100,
) {
	const startedAt = Date.now();

	while (Date.now() - startedAt < timeoutMs) {
		if (await fn()) {
			return;
		}

		await sleep(delayMs);
	}

	throw new Error(hint);
}

async function readStream(stream: ReadableStream<Uint8Array> | null | undefined) {
	return stream ? (await new Response(stream).text()).trim() : "";
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

function sharedEnv(): NodeJS.ProcessEnv {
	return {
		...process.env,
		VITE_ORIGIN: config.urls.app,
		VITE_SERVER_API: config.urls.api,
		VITE_APP_ASSETS: "/",
	};
}

function previewEnv(databaseUrl: string): NodeJS.ProcessEnv {
	return {
		...sharedEnv(),
		SERVER_DATABASE_URL: databaseUrl,
	};
}

function playwrightEnv(): NodeJS.ProcessEnv {
	return {
		...sharedEnv(),
		SERVER_DATABASE_URL: runtimeDatabaseUrl,
	};
}

async function waitForPostgresConnect(dsn: string, timeoutMs = config.timeouts.short) {
	const database = new URL(dsn).pathname.slice(1);
	let lastError = `Database "${database}" did not become ready in time`;

	await retry(
		() => {
			const result = dockerExec(
				"psql",
				"-U",
				config.postgres.user,
				"-d",
				database,
				"-c",
				"SELECT 1;",
			);

			if (result.stdout.includes("1 row")) {
				return true;
			}

			lastError = [
				result.stderr,
				result.stdout,
			]
				.filter(Boolean)
				.join("\n\n");

			return false;
		},
		timeoutMs,
		[
			`Postgres not accepting connections: ${dsn}`,
			lastError,
		]
			.filter(Boolean)
			.join("\n\n"),
		75,
	);
}

function prepareTemplateDatabase() {
	psql(
		config.postgres.rootDatabase,
		[
			"SELECT pg_terminate_backend(pid)",
			"FROM pg_stat_activity",
			`WHERE datname IN ('${config.postgres.runtimeDatabase}', '${config.postgres.templateDatabase}')`,
			"AND pid <> pg_backend_pid();",
		].join(" "),
		"Failed to terminate existing E2E database connections",
	);
	psql(
		config.postgres.rootDatabase,
		`DROP DATABASE IF EXISTS ${config.postgres.runtimeDatabase};`,
		"Failed to drop the E2E runtime database",
	);
	psql(
		config.postgres.rootDatabase,
		`DROP DATABASE IF EXISTS ${config.postgres.templateDatabase};`,
		"Failed to drop the E2E template database",
	);
	psql(
		config.postgres.rootDatabase,
		`CREATE DATABASE ${config.postgres.templateDatabase} OWNER ${config.postgres.user};`,
		"Failed to create the E2E template database",
	);
}

function cloneRuntimeDatabase() {
	psql(
		config.postgres.rootDatabase,
		[
			"SELECT pg_terminate_backend(pid)",
			"FROM pg_stat_activity",
			`WHERE datname = '${config.postgres.templateDatabase}'`,
			"AND pid <> pg_backend_pid();",
		].join(" "),
		"Failed to terminate template database connections",
	);
	psql(
		config.postgres.rootDatabase,
		[
			`CREATE DATABASE ${config.postgres.runtimeDatabase}`,
			`TEMPLATE ${config.postgres.templateDatabase}`,
			`OWNER ${config.postgres.user};`,
		].join(" "),
		"Failed to clone the E2E runtime database from template",
	);
}

async function ensurePostgresContainer() {
	shQuiet([
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
			"--rm",
			"--tmpfs",
			"/var/lib/postgresql/data:rw,uid=999,gid=999,mode=0700",
			"-e",
			`POSTGRES_USER=${config.postgres.user}`,
			"-e",
			`POSTGRES_PASSWORD=${config.postgres.password}`,
			"-e",
			`POSTGRES_DB=${config.postgres.rootDatabase}`,
			"-p",
			`${config.postgres.host}:${config.postgres.port}:5432`,
			config.postgres.image,
		],
		"Failed to start the dedicated E2E Postgres container",
	);

	try {
		await waitForPostgresConnect(`${databaseHostUrl}/${config.postgres.rootDatabase}`);
	} catch (error) {
		const logs = shOptional([
			"docker",
			"logs",
			config.postgres.container,
		])?.stdout;

		throw new Error(
			[
				error instanceof Error ? error.message : String(error),
				logs ? `Container logs:\n${logs}` : "",
			]
				.filter(Boolean)
				.join("\n\n"),
		);
	}
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
			"Failed to run server migrations for the E2E template database",
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
	const templateEnv = previewEnv(templateDatabaseUrl);
	const runtimeEnv = previewEnv(runtimeDatabaseUrl);
	const testEnv = playwrightEnv();

	try {
		run(
			[
				"docker",
				"version",
			],
			"Docker is not available",
		);
		await ensurePostgresContainer();
		prepareTemplateDatabase();
		await waitForPostgresConnect(templateDatabaseUrl);
		buildPreviewApps(templateEnv);
		startPreviewApps(templateEnv);
		await waitForHttp(
			`${config.urls.api}/api/public/health`,
			"Template preview API did not become ready in time",
		);
		await runMigration(templateEnv);
		await stopPreviewApps();
		cloneRuntimeDatabase();
		await waitForPostgresConnect(runtimeDatabaseUrl);
		startPreviewApps(runtimeEnv);
		await waitForHttp(
			`${config.urls.api}/api/public/health`,
			"Preview API did not become ready in time",
		);
		await waitForHttp(config.urls.app, "Preview app did not become ready in time");

		const tests = Bun.spawnSync({
			cmd: [
				"bun",
				"run",
				"e2e",
			],
			cwd: config.directories.e2e,
			env: testEnv,
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
