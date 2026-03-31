import type { Dialect } from "kysely";
import type { auth } from "~/server/auth/auth";

type AuthInstance = ReturnType<typeof auth>;

interface DatabaseRuntimeCache {
	dialectByDsn: Map<string, Dialect>;
	authByDsn: Map<string, AuthInstance>;
}

declare global {
	// Shared across server chunks in one runtime so a single DSN keeps one cache.
	// eslint-disable-next-line no-var
	var __zbavSeDatabaseRuntimeCache__: DatabaseRuntimeCache | undefined;
}

const globalRuntime = globalThis as typeof globalThis & {
	__zbavSeDatabaseRuntimeCache__?: DatabaseRuntimeCache;
};

export const databaseRuntimeCache: DatabaseRuntimeCache =
	globalRuntime.__zbavSeDatabaseRuntimeCache__ ??
	(globalRuntime.__zbavSeDatabaseRuntimeCache__ = {
		dialectByDsn: new Map(),
		authByDsn: new Map(),
	});
