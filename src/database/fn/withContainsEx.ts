import type { ReferenceExpression } from "kysely";
import { sql } from "kysely";

export function withContainsEx<DB, TB extends keyof DB>(
	column: ReferenceExpression<DB, TB>,
	term: string | undefined | null,
) {
	const value = term?.trim();

	if (!value) {
		return sql<boolean>`true`;
	}

	return sql<boolean>`
		lower(immutable_unaccent(${column})) like '%' || lower(immutable_unaccent(${value})) || '%'
	`;
}
