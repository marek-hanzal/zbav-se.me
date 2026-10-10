import { type Kysely, sql } from "kysely";

export namespace createDatabaseFromTemplateFn {
	export interface Props<TDatabase> {
		kysely: Kysely<TDatabase>;
		name: string;
		template: string;
	}
}

export const createDatabaseFromTemplateFn = async <TDatabase>({
	kysely,
	name,
	template,
}: createDatabaseFromTemplateFn.Props<TDatabase>) => {
	// The bootstrap closes and freezes the template before publishing its DSN.
	await sql`CREATE DATABASE ${sql.id(name)} TEMPLATE ${sql.id(template)}`.execute(kysely);
};
