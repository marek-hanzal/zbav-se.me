import { Context } from "effect";
import type { withBuyerSessionHono } from "~/@buyer-session/withBuyerSessionHono";
import type { withBuyerUserHono } from "~/@buyer-user/withBuyerUserHono";
import type { withPublicHono } from "~/@public/withPublicHono";
import type { withSellerSessionHono } from "~/@seller-session/withSellerSessionHono";
import type { withSellerUserHono } from "~/@seller-user/withSellerUserHono";
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
	 * Seller User app hono (/seller-user route)
	 *
	 * Seller-specific transaction and listing operations (private API).
	 */
	sellerUserHono: withSellerUserHono;
	/**
	 * Seller Session app hono (/seller-session route)
	 *
	 * Seller-specific operations for authenticated users (open API).
	 */
	sellerSessionHono: withSellerSessionHono;
	/**
	 * Buyer User app hono (/buyer-user route)
	 *
	 * Buyer-specific transaction operations (private API).
	 */
	buyerUserHono: withBuyerUserHono;
	/**
	 * Buyer Session app hono (/buyer-session route)
	 *
	 * Buyer-specific operations for authenticated users (open API).
	 */
	buyerSessionHono: withBuyerSessionHono;
}

export class RoutesContextFx extends Context.Tag("RoutesContextFx")<
	RoutesContextFx,
	RoutesContext
>() {
	//
}
