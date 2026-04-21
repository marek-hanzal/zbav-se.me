import { type Kysely, sql } from "kysely";

const TEMPLATE_CONNECTION_CHECK_DELAY = 25;
const TEMPLATE_CONNECTION_CHECK_LIMIT = 120;

type TemplateConnectionCountRow = {
	count: string;
};

export namespace waitForTemplateConnections {
	export interface Props<TDatabase> {
		kysely: Kysely<TDatabase>;
		template: string;
	}
}

export const waitForTemplateConnections = async <TDatabase>({
	kysely,
	template,
}: waitForTemplateConnections.Props<TDatabase>) => {
	for (let attempt = 0; attempt < TEMPLATE_CONNECTION_CHECK_LIMIT; attempt++) {
		const result =
			await sql<TemplateConnectionCountRow>`SELECT count(*)::text AS count FROM pg_stat_activity WHERE datname = ${template} AND pid <> pg_backend_pid()`.execute(
				kysely,
			);
		const connectionCount = Number(result.rows[0]?.count ?? "0");

		if (connectionCount === 0) {
			return;
		}

		await new Promise((resolve) => {
			setTimeout(resolve, TEMPLATE_CONNECTION_CHECK_DELAY);
		});
	}
};
