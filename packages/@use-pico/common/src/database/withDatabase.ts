import {
	type Dialect,
	Kysely,
	type MigrationProvider,
	type MigrationResult,
	Migrator,
} from "kysely";

export namespace withDatabase {
	export interface Props extends Partial<Pick<MigrationProvider, "getMigrations">> {
		dialect(): Promise<Dialect>;
		/**
		 * Called before the migration is executed.
		 */
		onPreMigration?(): Promise<void>;
		onPostMigration?(): Promise<void>;
	}

	export interface Instance<DB = any> {
		kysely(): Promise<Kysely<DB>>;
		migrate(): Promise<MigrationResult[] | undefined>;
	}
}

export const withDatabase = <TDatabase>({
	dialect,
	onPreMigration,
	onPostMigration,
	getMigrations = async () => ({}),
}: withDatabase.Props): withDatabase.Instance<TDatabase> => {
	let kysely: Kysely<TDatabase> | null = null;

	return {
		async kysely() {
			if (kysely) {
				return kysely;
			}

			return (kysely = new Kysely<TDatabase>({
				dialect: await dialect(),
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
		},
		async migrate() {
			await onPreMigration?.();

			const migrator = new Migrator({
				db: await this.kysely(),
				provider: {
					getMigrations,
				},
			});

			process.stdout.write("about to migrate\n");

			const { error, results } = await migrator.migrateToLatest();

			if (error) {
				throw error;
			}

			results?.forEach((result) => {
				process.stdout.write("something migrated\n");

				switch (result.status) {
					case "Success":
						console.log(`Migration "${result.migrationName}" executed successfully`);
						break;

					case "Error":
						console.error(`Migration "${result.migrationName}" failed`);
						break;
				}
			});

			await onPostMigration?.();

			process.stdout.write("tadaa\n");

			return results;
		},
	};
};
