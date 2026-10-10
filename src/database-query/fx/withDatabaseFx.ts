import type { Logger } from "@logtape/logtape";
import { Effect } from "effect";
import { type Dialect, Kysely } from "kysely";
import { type MigrationResult, Migrator } from "kysely/migration";
import { DialectContextFx } from "~/database-query/service/DialectContextFx";
import { MigrationContextFx } from "~/database-query/service/MigrationContextFx";

export namespace withDatabaseFx {
	export interface Event<in out TDatabase> {
		dialect: Dialect;
		kysely: Kysely<TDatabase>;
	}

	export interface Import<TDatabase> {
		name: string;
		/**
		 * Run the importer, output is ignored, "any" just for convenience to return any promise.
		 */
		runFn(instance: Instance<TDatabase>): Promise<any>;
	}

	export interface Props<in out TDatabase> {
		logger: Logger;
		/**
		 * Called before the migration is executed.
		 */
		onPreMigrationFn?(instance: Instance<TDatabase>): Promise<void>;
		onPostMigrationFn?(instance: Instance<TDatabase>): Promise<void>;
		/**
		 * Those are run after _every_ migration to sync data; importers should
		 * be independent, so every run should yield same result.
		 *
		 * Run after migrations (before onPostMigration hook), one-by-one, so they
		 * could depend on each other.
		 */
		imports?: Import<TDatabase>[];
	}

	export interface Instance<in out DB> {
		dialect: Dialect;
		kysely: Kysely<DB>;
		migrateFn(): Promise<MigrationResult[] | undefined>;
	}
}

export const withDatabaseFx = Effect.fn("withDatabaseFx")(function* <const TDatabase>({
	logger,
	onPreMigrationFn,
	onPostMigrationFn,
	imports = [],
}: withDatabaseFx.Props<TDatabase>) {
	const dialect = yield* DialectContextFx;
	const migrations = yield* MigrationContextFx;

	let kyselyInstance: Kysely<TDatabase> | null = null;

	const kyselyFn = () => {
		if (kyselyInstance) {
			return kyselyInstance;
		}

		const $logger = logger.getChild("query");

		return (kyselyInstance = new Kysely<TDatabase>({
			dialect,
			log(log) {
				switch (log.level) {
					case "error": {
						// logger.error("Kaboom", {
						// 	error: log.error,
						// });
						break;
					}
					case "query": {
						if (log.queryDurationMillis >= 30) {
							$logger.warn(log.query.sql, {
								ms: log.queryDurationMillis,
								params: log.query.parameters,
							});
							break;
						}

						$logger.trace(log.query.sql, {
							ms: log.queryDurationMillis,
							params: log.query.parameters,
						});

						break;
					}
				}
			},
		}));
	};

	const instance = {
		dialect,
		get kysely() {
			return kyselyFn();
		},
		async migrateFn() {
			const $logger = logger.getChild("migration");

			await onPreMigrationFn?.(instance);

			const migrator = new Migrator({
				db: kyselyFn(),
				provider: {
					getMigrations: async () => migrations,
				},
			});

			const { error, results } = await migrator.migrateToLatest();

			if (error) {
				throw error;
			}

			results?.forEach((result) => {
				switch (result.status) {
					case "Success":
						$logger.trace(`Migration "${result.migrationName}" executed successfully`, {
							migration: result.migrationName,
						});
						break;

					case "Error":
						logger.trace(`Migration "${result.migrationName}" failed`, {
							migration: result.migrationName,
							status: result.status,
						});
						break;
				}
			});

			for await (const { name, runFn } of imports) {
				$logger.trace(`Running import [${name}]`, {
					name,
				});
				await runFn(instance);
				$logger.trace(`Import [${name}] done`, {
					name,
				});
			}

			await onPostMigrationFn?.(instance);

			return results;
		},
	} satisfies withDatabaseFx.Instance<TDatabase>;

	return instance;
});
