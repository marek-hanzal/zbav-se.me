import { Context } from "effect";
import type { withPublicHono } from "~/@public/withPublicHono";
import type { withSellerHono } from "~/@seller/withSellerHono";
import type { withSessionHono } from "~/@session/withSessionHono";
import type { withUserHono } from "~/@user/withUserHono";
import type { withHono } from "~/hono/withHono";

export interface RoutesContext {
	/**
	 * Root app hono (/ route)
	 */
	root: withHono;
	/**
	 * Public app hono (/public route)
	 */
	publicHono: withPublicHono;
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
	/**
	 * Seller app hono (/seller route)
	 *
	 * Seller-specific transaction and listing operations.
	 */
	sellerHono: withSellerHono;
}

export class RoutesContextFx extends Context.Tag("RoutesContextFx")<
	RoutesContextFx,
	RoutesContext
>() {
	//
}
