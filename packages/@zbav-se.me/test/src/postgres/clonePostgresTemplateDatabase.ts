import { dropPostgresDatabase } from "./_internal/dropPostgresDatabase";
import { Client } from "pg";
import type { PostgresTestDatabase } from "./PostgresTestDatabase";

export const clonePostgresTemplateDatabase = async (
	options: PostgresTestDatabase.CloneOptions,
): Promise<PostgresTestDatabase.Clone> => {
	const databaseName = options.databaseName.replaceAll(/[^a-zA-Z0-9_]+/g, "_");
	const client = new Client({
		connectionString: `${options.baseUrl}/postgres`,
	});

	await client.connect();

	try {
		await client.query(`DROP DATABASE IF EXISTS "${databaseName}"`);
		await client.query(
			`CREATE DATABASE "${databaseName}" TEMPLATE "${options.templateDatabaseName}" OWNER "${options.user}"`,
		);
	} finally {
		await client.end();
	}

	return {
		databaseName,
		databaseUrl: `${options.baseUrl}/${databaseName}`,
		async drop() {
			await dropPostgresDatabase(options.baseUrl, databaseName);
		},
	};
};
