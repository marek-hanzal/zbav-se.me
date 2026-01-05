import { withDatabase } from "@use-pico/common/database";
import { genId } from "@use-pico/common/gen-id";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import type { Database } from "~/database/Database";

export const testabase = async () => {
	const db = genId();

	{
		const database = withDatabase<Database>({
			dialect: async () => {
				return new PostgresDialect({
					pool: new Pool({
						connectionString: `${process.env.SERVER_DATABASE_URL}/postgres`,
						max: 3,
					}),
				});
			},
		});

		const kysely = await database.kysely();

		await sql`CREATE DATABASE ${sql.ref(db)} TEMPLATE test OWNER test`.execute(kysely);

		await kysely.destroy();
	}

	return withDatabase<Database>({
		dialect: async () => {
			return new PostgresDialect({
				pool: new Pool({
					connectionString: `${process.env.SERVER_DATABASE_URL}/${db}`,
					max: 3,
				}),
			});
		},
	});
};
