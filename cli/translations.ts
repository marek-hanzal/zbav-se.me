import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { TranslationSources } from "@/lib/client/translation";
import { withDialectFx } from "@/lib/common/database";
import { tx } from "@/lib/server/tx";
import { translationSyncFx } from "~/common/translation/server/fx/translationSyncFx";
import { locales } from "~/locales";
import { databaseFx } from "~/server/database/databaseFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { Pool } from "~/server/database/pg";
import { ServerDatabaseSchema } from "~/server/env/ServerDatabaseSchema";

const source = `${__dirname}/../src/server/@migrations/translation`;

tx({
	packages: [
		`${__dirname}/..`,
	],
	output: source,
	locales,
	sources: TranslationSources,
});

const databaseConfig = ServerDatabaseSchema.parse(process.env);
const database = await databaseFx.pipe(
	withDialectFx(
		new PostgresDialect({
			pool: new Pool({
				connectionString: databaseConfig.SERVER_DATABASE_URL,
				max: 1,
			}),
		}),
	),
	Effect.runPromise,
);

await translationSyncFx({
	source,
}).pipe(withKyselyFx(database), Effect.runPromise);
