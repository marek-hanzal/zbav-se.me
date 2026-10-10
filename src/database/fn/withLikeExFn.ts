import type { ReferenceExpression } from "kysely";
import { sql } from "kysely";
import { match } from "ts-pattern";

export namespace withLikeExFn {
	export type Mode = "start" | "both";
}

export function withLikeExFn<DB, TB extends keyof DB>(
	column: ReferenceExpression<DB, TB>,
	term: string | undefined | null,
	mode: withLikeExFn.Mode = "both",
) {
	const tokens = term
		?.split(/\s+/g)
		.map((t) => t.trim())
		.filter(Boolean);

	if (!tokens || tokens.length === 0) {
		return sql<boolean>`true`;
	}

	const parts = match(mode)
		.with("start", () => {
			return tokens.map(
				(token) =>
					sql<boolean>`lower(immutable_unaccent(${column})) like ${sql`lower(immutable_unaccent(${token})) || '%'`}`,
			);
		})
		.with("both", () => {
			return tokens.map(
				(token) =>
					sql<boolean>`lower(immutable_unaccent(${column})) like '%' || ${sql`lower(immutable_unaccent(${token})) || '%'`}`,
			);
		})
		.exhaustive();

	return sql<boolean>`(${sql.join(parts, sql` or `)})`;
}
