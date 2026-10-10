import type { FieldTableSchema } from "~/database/schema/FieldTableSchema";
import type { Database } from "~/database/type/Database";
import fieldSeedData from "~/database-migration/data/field.json" with { type: "json" };
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";

export const importField: withDatabaseFx.Import<Database> = {
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
} as const;
