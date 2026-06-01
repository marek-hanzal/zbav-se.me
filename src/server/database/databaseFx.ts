import { Effect } from "effect";
import { MigrationContextFx, withDatabaseFx } from "@/lib/common/database";
import { getRootLogger } from "~/common/log/getRootLogger";
import { migrations } from "~/server/@migrations/migrations";
import { runAuthMigration } from "~/server/auth/runAuthMigration";
import type { Database } from "~/server/database/Database";
import { importField } from "./databaseFx/importField";
import { importFieldOption } from "./databaseFx/importFieldOption";
import { importRateLimitRule } from "./databaseFx/importRateLimitRule";
import { importResourceBundle } from "./databaseFx/importResourceBundle";
import { importResourceBundleItem } from "./databaseFx/importResourceBundleItem";
import { importResourceDefinition } from "./databaseFx/importResourceDefinition";
import { importTranslations } from "./databaseFx/importTranslations";

/**
 * Don't destructure stuff as there is Proxy
 */
export const databaseFx = withDatabaseFx<Database>({
	logger: getRootLogger([
		"db",
	]),
	async onPreMigration({ dialect }) {
		await runAuthMigration(dialect);
	},
	imports: [
		importTranslations,
		importField,
		importFieldOption,
		importRateLimitRule,
		importResourceDefinition,
		importResourceBundle,
		importResourceBundleItem,
	],
}).pipe(Effect.provideService(MigrationContextFx, migrations));
