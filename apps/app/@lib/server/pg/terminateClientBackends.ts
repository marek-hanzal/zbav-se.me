import { Client } from "pg";

export async function terminateClientBackends(dsn: string) {
	const client = new Client({
		connectionString: dsn,
	});

	await client.connect();

	try {
		await client.query(`
			SELECT
				pg_terminate_backend(pid, 500)
			FROM
				pg_stat_activity
			WHERE
				pid <> pg_backend_pid()
				AND backend_type = 'client backend'
		`);
	} finally {
		await client.end();
	}
}
