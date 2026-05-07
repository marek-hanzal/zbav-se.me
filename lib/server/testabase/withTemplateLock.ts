import { type Kysely, sql } from "kysely";

export namespace withTemplateLock {
	export interface Props<TDatabase> {
		kysely: Kysely<TDatabase>;
		template: string;
		callback: () => Promise<void>;
	}
}

export const withTemplateLock = async <TDatabase>({
	kysely,
	template,
	callback,
}: withTemplateLock.Props<TDatabase>) => {
	const lockKey = `testabase:${template}`;

	await sql`SELECT pg_advisory_lock(hashtextextended(${lockKey}, 0))`.execute(kysely);

	try {
		await callback();
	} finally {
		await sql`SELECT pg_advisory_unlock(hashtextextended(${lockKey}, 0))`.execute(kysely);
	}
};
