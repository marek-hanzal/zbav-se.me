import type { ReferenceExpression } from "kysely";
import { sql } from "kysely";
import { match } from "ts-pattern";

export namespace withNormalizedLikeExFn {
	export type Mode = "start" | "both";
}

export function withNormalizedLikeExFn<DB, TB extends keyof DB>(
	column: ReferenceExpression<DB, TB>,
	term: string | undefined | null,
	mode: withNormalizedLikeExFn.Mode = "both",
) {
	const tokens = term
		?.split(/\s+/g)
		.map((token) => token.trim())
		.filter(Boolean);

	if (!tokens || tokens.length === 0) {
		return sql<boolean>`true`;
	}

	const parts = match(mode)
		.with("start", () => {
			return tokens.map((token) => {
				return sql<boolean>`${column} like ${sql`lower(immutable_unaccent(${token})) || '%'`}`;
			});
		})
		.with("both", () => {
			return tokens.map((token) => {
				return sql<boolean>`${column} like '%' || ${sql`lower(immutable_unaccent(${token})) || '%'`}`;
			});
		})
		.exhaustive();

	return sql<boolean>`(${sql.join(parts, sql` or `)})`;
}
