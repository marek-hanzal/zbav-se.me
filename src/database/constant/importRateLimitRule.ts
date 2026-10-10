import type { Database } from "~/database/type/Database";
import rateLimitRuleSeedData from "~/database-migration/data/rule.json" with { type: "json" };
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";

export const importRateLimitRule: withDatabaseFx.Import<Database> = {
	name: "rate-limit-rule",
	async runFn({ kysely }) {
		return kysely
			.insertInto("rate_limit_rule")
			.values(rateLimitRuleSeedData)
			.onConflict((oc) => {
				return oc.column("name").doUpdateSet((ebFn) => ({
					limit: ebFn.ref("excluded.limit"),
					window: ebFn.ref("excluded.window"),
				}));
			})
			.execute();
	},
} as const;
