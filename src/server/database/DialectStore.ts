import { type Dialect, PostgresDialect } from "kysely";
import { Pool } from "~/server/database/pg";

export namespace DialectStore {
	export interface Entry {
		dialect: Dialect;
		pool: Pool<any>;
	}

	export interface CreatePoolProps {
		dsn: string;
		pool: Omit<Pool.Config<any>, "connectionString">;
		onError(error: Error): void;
	}
}

const entryMap = new Map<string, DialectStore.Entry>();

export const DialectStore = {
	createPool({ dsn, pool: props, onError }: DialectStore.CreatePoolProps) {
		const cached = entryMap.get(dsn);

		if (cached) {
			return cached.dialect;
		}

		const pool = new Pool({
			...props,
			connectionString: dsn,
		});
		pool.on("error", onError);

		const dialect = new PostgresDialect({
			pool,
		});

		entryMap.set(dsn, {
			dialect,
			pool,
		});

		return dialect;
	},
	async close(dsn: string) {
		const entry = entryMap.get(dsn);

		if (!entry) {
			return false;
		}

		entryMap.delete(dsn);
		await entry.pool.end();

		return true;
	},
} as const;
