import type { FieldTableSchema } from "~/database/schema/FieldTableSchema";
import type { Database } from "~/database/type/Database";
import fieldSeedData from "~/database-migration/data/field.json" with { type: "json" };
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";

export const importField: withDatabaseFx.Import<Database> = {
	name: "field",
	async runFn({ kysely }) {
		return kysely
			.insertInto("field")
			.values(fieldSeedData as FieldTableSchema.Type[])
			.onConflict((oc) => {
				return oc.column("name").doUpdateSet((ebFn) => ({
					min: ebFn.ref("excluded.min"),
					max: ebFn.ref("excluded.max"),
					step: ebFn.ref("excluded.step"),
				}));
			})
			.execute();
	},
} as const;
