import type { withDatabaseFx } from "@/lib/common/database";
import fieldSeedData from "~/server/@migrations/0005-field-seed/field.json" with { type: "json" };
import type { FieldTableSchema } from "../@table/FieldTableSchema";
import type { Database } from "../Database";

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
