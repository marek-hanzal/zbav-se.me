import { randomUUID } from "node:crypto";
import { createServer } from "node:net";
import { Effect } from "effect";
import { sql } from "kysely";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { MigrationContextFx } from "~/database-query/service/MigrationContextFx";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { shFn } from "~/shell/fn/shFn";
import { testabaseFn } from "~/test-database/fn/testabaseFn";
import { withTestabaseFx } from "~/test-database/fx/withTestabaseFx";

type BootstrapResource = Effect.Success<ReturnType<typeof withTestabaseFx>>;

const image = "nhost/postgres:17-20260320-1";
const databaseFx = withDatabaseFx<unknown>({
	logger: getRootLoggerFn([
		"test",
		"bootstrap-lifecycle",
	]),
}).pipe(Effect.provideService(MigrationContextFx, {}));

const ContainerInspectSchema = z.object({
	Name: z.string(),
	HostConfig: z.object({
		Tmpfs: z.record(z.string(), z.string()),
	}),
	NetworkSettings: z.object({
		Ports: z.record(
			z.string(),
			z
				.array(
					z.object({
						HostIp: z.string(),
						HostPort: z.string(),
					}),
				)
				.nullable(),
		),
	}),
});

describe("test database bootstrap", () => {
	it("runs same-prefix containers concurrently with distinct loopback ports and tmpfs storage", async () => {
		const prefix = `testabase-concurrent-${randomUUID()}`;
		const resources: BootstrapResource[] = [];
		const cleanups: (() => Promise<void>)[] = [];
		const errors: unknown[] = [];

		try {
			const outcomes = await Promise.allSettled(
				[
					0,
					1,
				].map(() =>
					withTestabaseFx({
						image,
						name: prefix,
						template: "test",
						databaseFx,
					}).pipe(Effect.runPromise),
				),
			);
			for (const outcome of outcomes) {
				if (outcome.status === "fulfilled") {
					resources.push(outcome.value);
					cleanups.push(outcome.value.cleanupFn);
				}
			}
			const failures = outcomes.filter((outcome) => outcome.status === "rejected");
			if (failures.length > 0) {
				throw new AggregateError(
					failures.map((failure) => failure.reason),
					"Concurrent bootstrap failed",
				);
			}

			expect(resources).toHaveLength(2);
			expect(new Set(resources.map((resource) => resource.containerName)).size).toBe(2);
			expect(new Set(resources.map((resource) => new URL(resource.dsn).port)).size).toBe(2);

			const inspected = ContainerInspectSchema.array().parse(
				JSON.parse(
					shFn(
						[
							"docker",
							"inspect",
							...resources.map((resource) => resource.containerName),
						],
						"Cannot inspect owned test containers",
					).stdout,
				),
			);
			for (const container of inspected) {
				expect(container.HostConfig.Tmpfs["/var/lib/postgresql/data"]).toContain("rw");
				const binding = container.NetworkSettings.Ports["5432/tcp"];
				expect(binding).toHaveLength(1);
				expect(binding?.[0]?.HostIp).toBe("127.0.0.1");
				const resource = resources.find(
					(resource) => `/${resource.containerName}` === container.Name,
				);
				if (!resource) {
					throw new Error(`Unexpected inspected container: ${container.Name}`);
				}
				expect(binding?.[0]?.HostPort).toBe(new URL(resource.dsn).port);
				const filesystem = shFn(
					[
						"docker",
						"exec",
						resource.containerName,
						"stat",
						"-f",
						"-c",
						"%T",
						"/var/lib/postgresql/data",
					],
					"Cannot verify the test Postgres data filesystem",
				).stdout;
				expect(filesystem).toBe("tmpfs");
			}

			for (const resource of resources) {
				const clone = await testabaseFn({
					dsn: resource.dsn,
					databaseFx,
					name: "bootstrap-proof",
					onTestFinishedFn(callbackFn) {
						cleanups.unshift(callbackFn);
					},
				});
				const result = await sql<{
					name: string;
				}>`SELECT current_database() AS name`.execute(clone.kysely);
				expect(result.rows).toEqual([
					{
						name: clone.databaseName,
					},
				]);
			}
		} catch (error) {
			errors.push(error);
		} finally {
			for (const cleanupFn of cleanups) {
				try {
					await cleanupFn();
				} catch (error) {
					errors.push(error);
				}
			}
		}
		if (errors.length > 0) {
			throw new AggregateError(errors, "Concurrent bootstrap lifecycle failed");
		}
	}, 30_000);

	it("removes its container when template initialization fails", async () => {
		const prefix = `testabase-failed-${randomUUID()}`;
		const initializationFailure = new Error("Intentional template initialization failure");
		let migrationAttempted = false;

		try {
			await expect(
				withTestabaseFx({
					image,
					name: prefix,
					template: "test",
					databaseFx,
					onMigrateFn: async () => {
						migrationAttempted = true;
						throw initializationFailure;
					},
				}).pipe(Effect.runPromise),
			).rejects.toMatchObject({
				cause: initializationFailure,
			});

			expect(migrationAttempted).toBe(true);
			expect(listOwnedContainersFn(prefix)).toEqual([]);
		} finally {
			removeOwnedContainersFn(prefix);
		}
	}, 30_000);

	it("removes a partially created container when its requested host port is occupied", async () => {
		const prefix = `testabase-occupied-port-${randomUUID()}`;
		const blocker = createServer();
		await new Promise<void>((resolveFn, rejectFn) => {
			blocker.once("error", rejectFn);
			blocker.listen(0, "127.0.0.1", resolveFn);
		});

		try {
			const address = blocker.address();
			if (address === null || typeof address === "string") {
				throw new Error("Expected a loopback TCP listener to reserve the test port");
			}
			await expect(
				withTestabaseFx({
					image,
					name: prefix,
					port: address.port,
					template: "test",
					databaseFx,
				}).pipe(Effect.runPromise),
			).rejects.toMatchObject({
				cause: expect.any(Error),
			});
			expect(listOwnedContainersFn(prefix)).toEqual([]);
		} finally {
			try {
				removeOwnedContainersFn(prefix);
			} finally {
				await new Promise<void>((resolveFn, rejectFn) => {
					blocker.close((error) => {
						if (error) rejectFn(error);
						else resolveFn();
					});
				});
			}
		}
	}, 30_000);
});

const listOwnedContainersFn = (prefix: string) => {
	return shFn(
		[
			"docker",
			"ps",
			"--all",
			"--filter",
			`name=^/${prefix}-`,
			"--format",
			"{{.Names}}",
		],
		"Cannot check owned test container cleanup",
	)
		.stdout.split("\n")
		.filter(Boolean);
};

const removeOwnedContainersFn = (prefix: string) => {
	const remaining = listOwnedContainersFn(prefix);
	if (remaining.length > 0) {
		shFn(
			[
				"docker",
				"rm",
				"-f",
				"-v",
				...remaining,
			],
			"Cannot remove failed bootstrap test containers",
		);
	}
};
