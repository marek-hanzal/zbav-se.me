import {
	type Dialect,
	Kysely,
	type MigrationProvider,
	type MigrationResult,
	Migrator,
} from "kysely";

export namespace withDatabase {
	export interface Props extends Partial<Pick<MigrationProvider, "getMigrations">> {
		dialect(): Dialect;
		/**
		 * Called before the migration is executed.
		 */
		onPreMigration?(dialect: Dialect): Promise<void>;
		onPostMigration?(dialect: Dialect): Promise<void>;
	}

	export interface Instance<DB = any> {
		dialect: Dialect;
		kysely: Kysely<DB>;
		migrate(): Promise<MigrationResult[] | undefined>;
	}
}

export const withDatabase = <TDatabase>({
	dialect,
	onPreMigration,
	onPostMigration,
	getMigrations = async () => ({}),
}: withDatabase.Props): withDatabase.Instance<TDatabase> => {
	let kyselyInstance: Kysely<TDatabase> | null = null;
	let dialectInstance: Dialect | null = null;

	return {
		get dialect() {
			if (dialectInstance) {
				return dialectInstance;
			}

			return (dialectInstance = dialect());
		},
		get kysely() {
			if (kyselyInstance) {
				return kyselyInstance;
			}

			return (kyselyInstance = new Kysely<TDatabase>({
				dialect: this.dialect,
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
			await onPreMigration?.(this.dialect);

			const migrator = new Migrator({
				db: this.kysely,
				provider: {
					getMigrations,
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

			await onPostMigration?.(this.dialect);

			return results;
		},
	};
};
