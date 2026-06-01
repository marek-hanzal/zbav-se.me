import type { withDatabaseFx } from "@/lib/common/database";
import rateLimitRuleSeedData from "~/server/@migrations/0046-rate-limit-rule/rule.json" with {
	type: "json",
};
import type { Database } from "../Database";

export const importRateLimitRule: withDatabaseFx.Import<Database> = {
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
} as const;
