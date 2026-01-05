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
		dialect(): Promise<Dialect>;
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
	let kyselyInstance: Kysely<TDatabase> | null = null;
	let dialectInstance: Dialect | null = null;

	return {
		async dialect() {
			if (dialectInstance) {
				return dialectInstance;
			}

			return (dialectInstance = await dialect());
		},
		async kysely() {
			if (kyselyInstance) {
				return kyselyInstance;
			}

			return (kyselyInstance = new Kysely<TDatabase>({
				dialect: await this.dialect(),
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

			await onPostMigration?.();

			return results;
		},
	};
};
