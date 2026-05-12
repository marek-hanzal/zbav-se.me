import { Effect } from "effect";
import { MigrationContextFx, withDatabaseFx } from "@/lib/common/database";
import { getRootLogger } from "~/common/log/getRootLogger";
import { translationSyncFx } from "~/common/translation/server/fx/translationSyncFx";
import fieldSeedData from "~/server/@migrations/0005-field-seed/field.json" with { type: "json" };
import fieldOptionSeedData from "~/server/@migrations/0005-field-seed/field-option.json" with {
	type: "json",
};
import rateLimitRuleSeedData from "~/server/@migrations/0046-rate-limit-rule/rule.json" with {
	type: "json",
};
import { migrations } from "~/server/@migrations/migrations";
import { runAuthMigration } from "~/server/auth/runAuthMigration";
import type { Database } from "~/server/database/Database";
import type { FieldTableSchema } from "./@table/FieldTableSchema";
import { withKyselyFx } from "./fx/withKyselyFx";

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
		{
			name: "translations",
			async run(instance) {
				return translationSyncFx().pipe(withKyselyFx(instance), Effect.runPromise);
			},
		},
		{
			name: "field",
			async run({ kysely }) {
				return kysely
					.insertInto("field")
					.values(fieldSeedData as FieldTableSchema.Type[])
					.onConflict((oc) => {
						return oc.column("name").doUpdateSet((eb) => ({
							min: eb.ref("excluded.min"),
							max: eb.ref("excluded.max"),
							step: eb.ref("excluded.step"),
						}));
					})
					.execute();
			},
		},
		{
			name: "field-option",
			async run({ kysely }) {
				return kysely
					.insertInto("field_option")
					.values(
						fieldOptionSeedData.map(({ field, ...rest }) => ({
							fieldId: field,
							...rest,
						})),
					)
					.onConflict((oc) => {
						return oc.doNothing();
					})
					.execute();
			},
		},
		{
			name: "rate-limit-rule",
			async run({ kysely }) {
				return kysely
					.insertInto("rate_limit_rule")
					.values(rateLimitRuleSeedData)
					.onConflict((oc) => {
						return oc.column("name").doUpdateSet((eb) => ({
							limit: eb.ref("excluded.limit"),
							window: eb.ref("excluded.window"),
						}));
					})
					.execute();
			},
		},
	],
}).pipe(Effect.provideService(MigrationContextFx, migrations));
