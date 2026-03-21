import { Client } from "pg";
import { sleep } from "./sleep";

export const waitForPostgresConnect = async (
	dsn: string,
	timeoutMs = 30_000,
) => {
	const startedAt = Date.now();

	while (Date.now() - startedAt < timeoutMs) {
		try {
			const client = new Client({
				connectionString: dsn,
			});
			await client.connect();
			await client.query("select 1");
			await client.end();
			return;
		} catch {
			//
		}

		await sleep(250);
	}

	throw new Error(`Postgres not accepting connections: ${dsn}`);
};
