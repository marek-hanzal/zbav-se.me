export namespace PostgresTestDatabase {
	export interface CloneOptions {
		baseUrl: string;
		databaseName: string;
		templateDatabaseName: string;
		user: string;
	}

	export interface Clone {
		databaseName: string;
		databaseUrl: string;
		drop: () => Promise<void>;
	}

	export interface Options {
		containerName: string;
		image: string;
		password: string;
		port: number;
		repoRoot: string;
		templateDatabaseName: string;
		user: string;
		volumeName: string;
		onTemplateReady?: (input: {
			baseUrl: string;
			templateDatabaseUrl: string;
		}) => Promise<void>;
	}

	export interface Setup {
		baseUrl: string;
		cloneDatabase: (id: string) => Promise<Clone>;
		templateDatabaseUrl: string;
		teardown: () => Promise<void>;
	}
}
