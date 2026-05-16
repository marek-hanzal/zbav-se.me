import { Effect } from "effect";
import { getMigrations } from "better-auth/db/migration";
import type { Dialect } from "kysely";
import { withDialectFx } from "@/lib/common/database";
import { auth } from "~/server/auth/auth";
import { databaseFx } from "~/server/database/databaseFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withTranslatorFx } from "~/translator/server/fx/withTranslatorFx";

export const runAuthMigration = async (dialect: Dialect) => {
	const database = await databaseFx.pipe(withDialectFx(dialect), Effect.runPromise);
	const translator = await withTranslatorFx({
		locale: "migration",
	}).pipe(withKyselyFx(database), Effect.runPromise);

	const { options } = auth({
		dialect: () => dialect,
		translator,
	});

	return getMigrations(options).then(({ runMigrations }) => {
		return runMigrations();
	});
};
