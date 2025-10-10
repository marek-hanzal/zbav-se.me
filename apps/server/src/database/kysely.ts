// export const { kysely, bootstrap } = withDatabase<Database>({
// 	dialect: new PostgresDialect({
// 		pool: new Pool({
// 			connectionString: process.env.DATABASE_URL,
// 			max: 5,
// 		}),
// 	}),
// 	async getMigrations() {
// 		return migrations;
// 	},
// 	async bootstrap() {},
// });
