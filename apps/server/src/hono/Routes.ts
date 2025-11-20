import type { withHono } from "./withHono";
import type { withSessionHono } from "./withSessionHono";
import type { withUserHono } from "./withUserHono";

export namespace Routes {
	export type FnWithDeps<TDependencies extends Record<string, unknown> = {}> = (
		routes: Routes,
		deps: TDependencies,
	) => void;

	export type Fn = (routes: Routes) => void;
}

export interface Routes {
	/**
	 * Root app hono (/ route)
	 */
	root: withHono;
	/**
	 * Public app hono (/public route)
	 */
	publicHono: withHono;
	/**
	 * Session app hono (/session route)
	 *
	 * Requires (any) session; used for "private-public" data access.
	 */
	sessionHono: withSessionHono;
	/**
	 * User app hono (/user route)
	 *
	 * Private-only data access.
	 */
	userHono: withUserHono;
}
