import { Context, Effect } from "effect";
import type { withHono } from "~/hono/withHono";
import type { withSessionHono } from "~/hono/withSessionHono";
import type { withUserHono } from "~/hono/withUserHono";

export interface RoutesContext {
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

export class RoutesContextFx extends Context.Tag("RoutesContextFx")<
	RoutesContextFx,
	RoutesContext
>() {
	//
}

export const RoutesContextProvider = (context: RoutesContext) => {
	return Effect.provideService(RoutesContextFx, context);
};
