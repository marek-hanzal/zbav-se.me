import type { withDatabaseFx } from "@/lib/common/database";
import fieldOptionSeedData from "~/server/@migrations/0005-field-seed/field-option.json" with {
	type: "json",
};
import type { Database } from "../Database";

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
