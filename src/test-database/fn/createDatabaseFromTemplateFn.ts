import { type Kysely, sql } from "kysely";
import { waitForTemplateConnectionsFn } from "~/test-database/fn/waitForTemplateConnectionsFn";

const TEMPLATE_CREATE_ATTEMPT_LIMIT = 10;

type PostgresError = {
	code?: string;
};

const isTemplateAccessErrorFn = (error: unknown) => {
	return (error as PostgresError).code === "55006";
};

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
	for (let attempt = 0; attempt < TEMPLATE_CREATE_ATTEMPT_LIMIT; attempt++) {
		await waitForTemplateConnectionsFn({
			kysely,
			template,
		});

		try {
			await sql`CREATE DATABASE ${sql.ref(name)} TEMPLATE ${sql.ref(template)}`.execute(
				kysely,
			);
			return;
		} catch (error) {
			if (!isTemplateAccessErrorFn(error) || attempt === TEMPLATE_CREATE_ATTEMPT_LIMIT - 1) {
				throw error;
			}
		}
	}
};
