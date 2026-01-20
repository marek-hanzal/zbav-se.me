import { Effect } from "effect";
import { type Dialect, Kysely, type MigrationResult, Migrator } from "kysely";
import { DialectContextFx } from "./DialectContextFx";
import { MigrationContextFx } from "./MigrationContextFx";

export namespace withDatabaseFx {
	export interface Event<TDatabase> {
		dialect: Dialect;
		kysely: Kysely<TDatabase>;
	}

	export interface Props<TDatabase> {
		/**
		 * Called before the migration is executed.
		 */
		onPreMigration?(event: withDatabaseFx.Event<TDatabase>): Promise<void>;
		onPostMigration?(event: withDatabaseFx.Event<TDatabase>): Promise<void>;
	}

	export interface Instance<DB = any> {
		dialect: Dialect;
		kysely: Kysely<DB>;
		migrate(): Promise<MigrationResult[] | undefined>;
	}
}

export const withDatabaseFx = Effect.fn("withDatabaseFx")(function* <TDatabase>({
	onPreMigration,
	onPostMigration,
}: withDatabaseFx.Props<TDatabase>) {
	const dialect = yield* DialectContextFx;
	const migrations = yield* MigrationContextFx;

	let kyselyInstance: Kysely<TDatabase> | null = null;

	const kysely = () => {
		if (kyselyInstance) {
			return kyselyInstance;
		}

		return (kyselyInstance = new Kysely<TDatabase>({
			dialect,
			log(log) {
				switch (log.level) {
					case "error": {
						console.error(log.error);
						break;
					}
					case "query": {
						// console.log(log.query.sql);
						break;
					}
				}
			},
		}));
	};

	return {
		dialect,
		get kysely() {
			return kysely();
		},
		async migrate() {
			await onPreMigration?.({
				dialect,
				kysely: kysely(),
			});

			const migrator = new Migrator({
				db: kysely(),
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
						console.log(`Migration "${result.migrationName}" executed successfully`);
						break;

					case "Error":
						console.error(`Migration "${result.migrationName}" failed`);
						break;
				}
			});

			await onPostMigration?.({
				dialect,
				kysely: kysely(),
			});

			return results;
		},
	};
});
