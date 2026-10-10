import { Client } from "pg";
import { sleepFn } from "~/timing/fn/sleepFn";

export async function waitForConnectFn(dsn: string, timeoutMs = 15_000) {
	const started = Date.now();
	let lastError = "unknown";

	while (Date.now() - started < timeoutMs) {
		const client = new Client({
			connectionString: dsn,
			connectionTimeoutMillis: 250,
			query_timeout: 1_000,
		});
		try {
			await client.connect();
			await client.query("select 1");
			return;
		} catch (error) {
			lastError = error instanceof Error ? error.message : String(error);
		} finally {
			await client.end();
		}
		await sleepFn(75);
	}

	const target = new URL(dsn);
	throw new Error(
		`Postgres not accepting connections at ${target.host}${target.pathname}\n${lastError}`,
	);
}
