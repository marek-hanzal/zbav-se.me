import type { Database } from "~/database/type/Database";
import fieldOptionSeedData from "~/database-migration/data/field-option.json" with { type: "json" };
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";

export const importFieldOption: withDatabaseFx.Import<Database> = {
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
} as const;
