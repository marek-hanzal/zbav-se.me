import { DialectContextFx, type withDatabaseFx } from "@use-pico/common/database";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";

export namespace testabase {
	export interface Props<
		out TDatabaseFx extends Effect.Effect<withDatabaseFx.Instance, any, DialectContextFx>,
	> {
		databaseFx: TDatabaseFx;
		template?: string;
		name?: string;
		onTestFinished(callbackFn: () => Promise<any>): void;
	}
}

export const testabase = async <
	const TDatabaseFx extends Effect.Effect<withDatabaseFx.Instance, any, DialectContextFx>,
>({
	databaseFx,
	template = "test",
	name = genId(),
	onTestFinished,
}: testabase.Props<TDatabaseFx>) => {
	return Effect.gen(function* () {
		const { kysely } = yield* databaseFx.pipe(
			Effect.provideService(
				DialectContextFx,
				new PostgresDialect({
					pool: new Pool({
						connectionString: `${process.env.SERVER_DATABASE_URL}/postgres`,
						max: 1,
					}),
				}),
			),
		);

		yield* Effect.promise(async () =>
			sql`DROP DATABASE IF EXISTS ${sql.ref(name)}`.execute(kysely),
		);

		yield* Effect.promise(async () =>
			sql`CREATE DATABASE ${sql.ref(name)} TEMPLATE ${sql.ref(template)}`.execute(kysely),
		);

		yield* Effect.promise(async () => kysely.destroy());

		const instance = yield* databaseFx.pipe(
			Effect.provideService(
				DialectContextFx,
				new PostgresDialect({
					pool: new Pool({
						connectionString: `${process.env.SERVER_DATABASE_URL}/${name}`,
						max: 4,
					}),
				}),
			),
		);

		onTestFinished(async () => {
			await instance.kysely.destroy();
		});

		return instance;
	}).pipe(Effect.runPromise);
};
