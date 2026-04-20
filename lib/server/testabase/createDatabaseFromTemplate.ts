import { type Kysely, sql } from "kysely";
import { waitForTemplateConnections } from "./waitForTemplateConnections";

const TEMPLATE_CREATE_ATTEMPT_LIMIT = 10;

type PostgresError = {
	code?: string;
};

const isTemplateAccessError = (error: unknown) => {
	return (error as PostgresError).code === "55006";
};

export namespace createDatabaseFromTemplate {
	export interface Props<TDatabase> {
		kysely: Kysely<TDatabase>;
		name: string;
		template: string;
	}
}

export const createDatabaseFromTemplate = async <TDatabase>({
	kysely,
	name,
	template,
}: createDatabaseFromTemplate.Props<TDatabase>) => {
	for (let attempt = 0; attempt < TEMPLATE_CREATE_ATTEMPT_LIMIT; attempt++) {
		await waitForTemplateConnections({
			kysely,
			template,
		});

		try {
			await sql`CREATE DATABASE ${sql.ref(name)} TEMPLATE ${sql.ref(template)}`.execute(
				kysely,
			);
			return;
		} catch (error) {
			if (!isTemplateAccessError(error) || attempt === TEMPLATE_CREATE_ATTEMPT_LIMIT - 1) {
				throw error;
			}
		}
	}
};
