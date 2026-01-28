import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { Effect } from "effect";
import { RoutesContextFx } from "~/routes/context/RoutesContextFx";
import { ServerViteSchema } from "~/schema/env/ServerViteSchema";

const docsUrl = "/v3/api-docs";

const tags: Record<string, { name: string; description: string }> = {
    "Misc": {
        name: "Misc",
        description: "Miscellaneous endpoints for system operations",
    },
    "GitHub": {
        name: "GitHub",
        description: "GitHub commit history synchronization",
    },
} as const;

export const withOpenApiEndpointFx = Effect.fn("withOpenApiEndpointFx")(function* () {
	const {
		root,
		publicHono,
		sessionHono,
		userHono,
		sellerUserHono,
		sellerSessionHono,
		buyerUserHono,
		buyerSessionHono,
	} = yield* RoutesContextFx;

	const viteConfig = ServerViteSchema.parse(process.env);
	const apiBase = viteConfig.VITE_SERVER_API.replace(/\/$/, "");

	root.get(
		"/",
		Scalar({
			title: "zbav.se.me API",
			pageTitle: "zbav.se.me API",
			sources: [
				{
					url: `${docsUrl}/public`,
					title: "Public",
				},
				{
					url: `${docsUrl}/session`,
					title: "Session",
				},
				{
					url: `${docsUrl}/user`,
					title: "User",
				},
				{
					url: `${docsUrl}/seller-user`,
					title: "Seller User",
				},
				{
					url: `${docsUrl}/seller-session`,
					title: "Seller Session",
				},
				{
					url: `${docsUrl}/buyer-user`,
					title: "Buyer User",
				},
				{
					url: `${docsUrl}/buyer-session`,
					title: "Buyer Session",
				},
				{
					url: "/api/auth/open-api/generate-schema",
					title: "Auth",
				},
			],
		}),
	);

	const cookieAuth = {
		components: {
			securitySchemes: {
				cookieAuth: {
					type: "apiKey",
					in: "cookie",
					name: "better-auth.session_token",
					description: "Cookie-based authentication using better-auth session token",
				},
			},
		},
		security: [
			{
				cookieAuth: [],
			},
		],
	};

	const docWithMount = (
		mount: string,
		app: OpenAPIHono<any>,
		opts: Parameters<OpenAPIHono["getOpenAPI31Document"]>[0],
	) => {
		const tmp = new OpenAPIHono();
		tmp.route(mount, app);
		return tmp.getOpenAPI31Document({
			...opts,
			servers: [
				{
					url: apiBase,
				},
			],
		});
	};

	let cache: null | {
		public: unknown;
		session: unknown;
		user: unknown;
		sellerUser: unknown;
		sellerSession: unknown;
		buyerUser: unknown;
		buyerSession: unknown;
	} = null;

	const docs = () => {
		if (cache) {
			return cache;
		}

		cache = {
			public: docWithMount("/api/public", publicHono, {
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "Public zbav-se.me API",
					description: "Public API for the zbav-se.me app",
				},
				security: [],
				tags: [
					{
						name: "Misc",
						description: "Miscellaneous endpoints for system operations",
					},
					{
						name: "GitHub",
						description: "GitHub commit history synchronization",
					},
					{
						name: "Janitor",
						description: "System cleanup and maintenance operations",
					},
					{
						name: "Cron",
						description: "Scheduled cron job endpoints",
					},
				],
			}),

			session: docWithMount("/api/session", sessionHono, {
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "Protected zbav-se.me API",
					description: "Auth-required API, but open to any user without restriction",
				},
				...cookieAuth,
				tags: [
					{
						name: "Category",
						description: "Category queries",
					},
					{
						name: "Location",
						description: "Location queries and autocomplete",
					},
					{
						name: "Upload",
						description: "Upload file queries",
					},
				],
			}),

			user: docWithMount("/api/user", userHono, {
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "User zbav-se.me API",
					description: "API related to the user, needs user's context (private data).",
				},
				...cookieAuth,
				tags: [
					{
						name: "Gallery",
						description: "Gallery management for images",
					},
					{
						name: "Message Thread",
						description: "Message thread management",
					},
					{
						name: "S3",
						description: "S3 pre-signed URL generation for direct uploads",
					},
					{
						name: "Transaction Message Gallery",
						description: "Gallery/image messages within transactions",
					},
					{
						name: "Transaction Message Location",
						description: "Location messages within transactions",
					},
					{
						name: "Transaction Message Package",
						description: "Package delivery information messages within transactions",
					},
					{
						name: "Transaction Message Personal",
						description: "Personal contact information messages within transactions",
					},
					{
						name: "Transaction Message Text",
						description: "Text messages within transactions",
					},
					{
						name: "Transaction Status",
						description:
							"Transaction status management (reject, dispute)",
					},
					{
						name: "Upload",
						description: "Upload file management",
					},
					{
						name: "User Ex",
						description: "Extended user information management",
					},
				],
			}),

			sellerUser: docWithMount("/api/seller-user", sellerUserHono, {
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "Seller User zbav-se.me API",
					description:
						"Private API for seller - requires authentication and access to user's private data",
				},
				...cookieAuth,
				tags: [
					{
						name: "Draft",
						description: "Draft is the base (kinda template) for all listings",
					},
					{
						name: "Draft Gallery",
						description: "Gallery management for draft listings",
					},
					{
						name: "Listing",
						description: "Listing creation and management",
					},
					{
						name: "Transaction Listing",
						description: "Listings that have transactions",
					},
					{
						name: "Transaction Status",
						description:
							"Transaction status management (accept, resolve)",
					},
					{
						name: "User Event Seller",
						description: "Seller event metrics and analytics",
					},
				],
			}),

			sellerSession: docWithMount("/api/seller-session", sellerSessionHono, {
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "Seller Session zbav-se.me API",
					description:
						"Open API for seller for authenticated users - requires session, but data is public",
				},
				...cookieAuth,
				tags: [
					{
						name: "Listing",
						description: "Listing information and seller details",
					},
				],
			}),

			buyerUser: docWithMount("/api/buyer-user", buyerUserHono, {
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "Buyer User zbav-se.me API",
					description:
						"Private API for buyer - requires authentication and access to user's private data",
				},
				...cookieAuth,
				tags: [
					{
						name: "Feed",
						description: "Feed is user setup (query) for listings",
					},
					{
						name: "Feed Favourite",
						description:
							"Feed Favourite is the collection of listings that are favourite",
					},
					{
						name: "Feed Gallery",
						description: "Gallery management for feed listings",
					},
					{
						name: "Favourite",
						description: "Favourite listing management",
					},
					{
						name: "Flag",
						description: "Listing flagging management",
					},
					{
						name: "Ignore",
						description: "Listing ignore management",
					},
					{
						name: "Thumb",
						description: "Thumb (like) management for listings",
					},
					{
						name: "Transaction",
						description: "Transaction management between buyer and seller",
					},
					{
						name: "Transaction Status",
						description:
							"Transaction status management (success, close)",
					},
					{
						name: "User Event Buyer",
						description: "Buyer event metrics and analytics",
					},
				],
			}),

			buyerSession: docWithMount("/api/buyer-session", buyerSessionHono, {
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "Buyer Session zbav-se.me API",
					description:
						"Open API for buyer for authenticated users - requires session, but data is public",
				},
				...cookieAuth,
				tags: [
					{
						name: "Listing",
						description: "Listing information and queries",
					},
					{
						name: "Listing Event",
						description: "Listing event tracking and analytics",
					},
					{
						name: "Transaction",
						description: "Transaction information and buyer details",
					},
				],
			}),
		};

		return cache;
	};

	root.get(`${docsUrl}/public`, (c) => c.json(docs().public));
	root.get(`${docsUrl}/session`, (c) => c.json(docs().session));
	root.get(`${docsUrl}/user`, (c) => c.json(docs().user));
	root.get(`${docsUrl}/seller-user`, (c) => c.json(docs().sellerUser));
	root.get(`${docsUrl}/seller-session`, (c) => c.json(docs().sellerSession));
	root.get(`${docsUrl}/buyer-user`, (c) => c.json(docs().buyerUser));
	root.get(`${docsUrl}/buyer-session`, (c) => c.json(docs().buyerSession));

	root.doc31(docsUrl, {
		openapi: "3.1.0",
		info: {
			version: "0.5.0",
			title: "zbav.se.me API",
		},
		servers: [
			{
				url: apiBase,
			},
		],
		...cookieAuth,
	});
});
