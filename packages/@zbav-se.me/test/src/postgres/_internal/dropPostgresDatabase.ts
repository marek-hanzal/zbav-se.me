import { Client } from "pg";

export const dropPostgresDatabase = async (baseUrl: string, databaseName: string) => {
	const client = new Client({
		connectionString: `${baseUrl}/postgres`,
	});

	await client.connect();

	try {
		await client.query(`DROP DATABASE IF EXISTS "${databaseName}"`);
	} finally {
		await client.end();
	}
};
