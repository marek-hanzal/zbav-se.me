import type { ReferenceExpression } from "kysely";
import { sql } from "kysely";

export function withNormalizedContainsEx<DB, TB extends keyof DB>(
	column: ReferenceExpression<DB, TB>,
	term: string | undefined | null,
) {
	const value = term?.trim();

	if (!value) {
		return sql<boolean>`true`;
	}

	return sql<boolean>`
		${column} like '%' || lower(immutable_unaccent(${value})) || '%'
	`;
}
