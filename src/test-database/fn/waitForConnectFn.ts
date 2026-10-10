import { Client } from "pg";
import { sleepFn } from "~/timing/fn/sleepFn";

export async function waitForConnectFn(dsn: string, timeoutMs = 15_000) {
	const started = Date.now();
	let lastError = "unknown";

	while (Date.now() - started < timeoutMs) {
		try {
			const client = new Client({
				connectionString: dsn,
				connectionTimeoutMillis: 250,
			});
			await client.connect();
			await client.query("select 1");
			await client.end();
			return;
		} catch (error) {
			lastError = error instanceof Error ? error.message : String(error);
			await sleepFn(75);
		}
	}

	throw new Error(`Postgres not accepting connections: ${dsn}\n${lastError}`);
}
