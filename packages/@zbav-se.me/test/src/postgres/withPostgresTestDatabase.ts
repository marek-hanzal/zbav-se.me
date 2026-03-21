import path from "node:path";
import { sh } from "./_internal/sh";
import { waitForPostgresConnect } from "./_internal/waitForPostgresConnect";
import { waitForTcp } from "./_internal/waitForTcp";
import { clonePostgresTemplateDatabase } from "./clonePostgresTemplateDatabase";
import type { PostgresTestDatabase } from "./PostgresTestDatabase";

export const withPostgresTestDatabase = async (
	options: PostgresTestDatabase.Options,
): Promise<PostgresTestDatabase.Setup> => {
	const repoRoot = path.resolve(options.repoRoot);
	const baseUrl = `postgresql://${options.user}:${options.password}@127.0.0.1:${options.port}`;
	const templateDatabaseUrl = `${baseUrl}/${options.templateDatabaseName}`;

	sh(
		[
			"docker",
			"version",
		],
		repoRoot,
		"Docker is not available",
	);

	const imageExists = (() => {
		try {
			const { stdout } = sh(
				[
					"docker",
					"image",
					"inspect",
					options.image,
				],
				repoRoot,
				"",
			);

			return stdout.length > 0;
		} catch {
			return false;
		}
	})();

	if (!imageExists) {
		console.log("Building Postgres image");
		sh(
			[
				"docker",
				"build",
				"--platform=linux/amd64",
				"-t",
				options.image,
				".",
			],
			repoRoot,
			`Failed to build image "${options.image}"`,
		);
	}

	Bun.spawnSync({
		cmd: [
			"docker",
			"rm",
			"-f",
			options.containerName,
		],
		cwd: repoRoot,
		stdout: "ignore",
		stderr: "ignore",
	});

	sh(
		[
			"docker",
			"run",
			"-d",
			"--name",
			options.containerName,
			"-v",
			`${options.volumeName}:/var/lib/postgresql/data`,
			"-e",
			`POSTGRES_USER=${options.user}`,
			"-e",
			`POSTGRES_PASSWORD=${options.password}`,
			"-e",
			`POSTGRES_DB=${options.templateDatabaseName}`,
			"-p",
			`127.0.0.1:${options.port}:5432`,
			options.image,
		],
		repoRoot,
		"Failed to start Postgres container (port busy?)",
	);

	await waitForTcp("127.0.0.1", options.port);
	await waitForPostgresConnect(templateDatabaseUrl);

	if (options.onTemplateReady) {
		await options.onTemplateReady({
			baseUrl,
			templateDatabaseUrl,
		});
	}

	return {
		baseUrl,
		templateDatabaseUrl,
		async cloneDatabase(id: string) {
			return clonePostgresTemplateDatabase({
				baseUrl,
				databaseName: id,
				templateDatabaseName: options.templateDatabaseName,
				user: options.user,
			});
		},
		async teardown() {
			const containerProc = Bun.spawn(
				[
					"docker",
					"rm",
					"-f",
					options.containerName,
				],
				{
					cwd: repoRoot,
					stdout: "ignore",
					stderr: "ignore",
				},
			);
			await containerProc.exited;

			const volumeProc = Bun.spawn(
				[
					"docker",
					"volume",
					"rm",
					options.volumeName,
				],
				{
					cwd: repoRoot,
					stdout: "ignore",
					stderr: "ignore",
				},
			);
			await volumeProc.exited;
		},
	};
};
