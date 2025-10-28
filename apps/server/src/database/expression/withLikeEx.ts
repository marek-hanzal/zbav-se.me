import type { ReferenceExpression } from "kysely";
import { sql } from "kysely";

export function withLikeEx<DB, TB extends keyof DB>(
	column: ReferenceExpression<DB, TB>,
	term: string | undefined | null,
) {
	const tokens = term
		?.split(/\s+/g)
		.map((t) => t.trim())
		.filter(Boolean);

	if (!tokens || tokens.length === 0) {
		return sql<boolean>`true`;
	}

	const parts = tokens.map(
		(t) =>
			sql<boolean>`lower(unaccent(${column})) like ${sql`lower(unaccent(${t})) || '%'`}`,
	);

	return sql<boolean>`(${sql.join(parts, sql` or `)})`;
}
