import { type Kysely, sql } from "kysely";

export namespace withTemplateLockFn {
	export interface Props<TDatabase> {
		kysely: Kysely<TDatabase>;
		template: string;
		callbackFn: () => Promise<void>;
	}
}

export const withTemplateLockFn = async <TDatabase>({
	kysely,
	template,
	callbackFn,
}: withTemplateLockFn.Props<TDatabase>) => {
	const lockKey = `testabase:${template}`;

	await sql`SELECT pg_advisory_lock(hashtextextended(${lockKey}, 0))`.execute(kysely);

	try {
		await callbackFn();
	} finally {
		await sql`SELECT pg_advisory_unlock(hashtextextended(${lockKey}, 0))`.execute(kysely);
	}
};
