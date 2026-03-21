import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { Effect } from "effect";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerViteSchema } from "~/schema/env/ServerViteSchema";

const docsUrl = "/v3/api-docs";

const tagsRegistry: Record<
	string,
	{
		name: string;
		description: string;
	}
> = {
	Misc: {
		name: "Misc",
		description: "Miscellaneous endpoints for system operations",
	},
	GitHub: {
		name: "GitHub",
		description: "GitHub commit history synchronization",
	},
	Janitor: {
		name: "Janitor",
		description: "System cleanup and maintenance operations",
	},
	Cron: {
		name: "Cron",
		description: "Scheduled cron job endpoints",
	},
	Category: {
		name: "Category",
		description: "Category queries",
	},
	Location: {
		name: "Location",
		description: "Location queries and autocomplete",
	},
	Upload: {
		name: "Upload",
		description: "Upload file queries",
	},
	Gallery: {
		name: "Gallery",
		description: "Gallery management for images",
	},
	"Transaction Entry": {
		name: "Transaction Entry",
		description: "Transaction timeline entry queries and writes",
	},
	Inbox: {
		name: "Inbox",
		description: "Inbox notifications and archival flows",
	},
	S3: {
		name: "S3",
		description: "S3 pre-signed URL generation for direct uploads",
	},
	"User Ex": {
		name: "User Ex",
		description: "Extended user information management",
	},
	Draft: {
		name: "Draft",
		description: "Draft is the base (kinda template) for all listings",
	},
	"Draft Gallery": {
		name: "Draft Gallery",
		description: "Gallery management for draft listings",
	},
	Listing: {
		name: "Listing",
		description: "Listing information and management",
	},
	"Transaction Listing": {
		name: "Transaction Listing",
		description: "Listings that have transactions",
	},
	"User Event Seller": {
		name: "User Event Seller",
		description: "Seller event metrics and analytics",
	},
	Feed: {
		name: "Feed",
		description: "Feed is user setup (query) for listings",
	},
	"Feed Favourite": {
		name: "Feed Favourite",
		description: "Feed Favourite is the collection of listings that are favourite",
	},
	"Feed Gallery": {
		name: "Feed Gallery",
		description: "Gallery management for feed listings",
	},
	Favourite: {
		name: "Favourite",
		description: "Favourite listing management",
	},
	Flag: {
		name: "Flag",
		description: "Listing flagging management",
	},
	Ignore: {
		name: "Ignore",
		description: "Listing ignore management",
	},
	Thumb: {
		name: "Thumb",
		description: "Thumb (like) management for listings",
	},
	Transaction: {
		name: "Transaction",
		description: "Transaction management between buyer and seller",
	},
	"User Event Buyer": {
		name: "User Event Buyer",
		description: "Buyer event metrics and analytics",
	},
	"Listing Event": {
		name: "Listing Event",
		description: "Listing event tracking and analytics",
	},
	Enum: {
		name: "Enum",
		description: "Public enum values",
	},
	Schema: {
		name: "Schema",
		description: "OpenAPI schema exposure only – endpoints return 400",
	},
	mcp: {
		name: "mcp",
		description: "Endpoints exposed through MCP bridge tooling",
	},
} as const;

const extractTagsFromOpenApiDocument = (
	doc: ReturnType<OpenAPIHono["getOpenAPI31Document"]>,
): Array<{
	name: string;
	description: string;
}> => {
	const usedTags = new Set<string>();

	if (doc.paths) {
		for (const pathItem of Object.values(doc.paths)) {
			if (!pathItem) continue;
			const operations = [
				pathItem.get,
				pathItem.post,
				pathItem.put,
				pathItem.patch,
				pathItem.delete,
				pathItem.head,
				pathItem.options,
			].filter(Boolean);

			for (const operation of operations) {
				if (operation?.tags) {
					for (const tag of operation.tags) {
						usedTags.add(tag);
					}
				}
			}
		}
	}

	return Array.from(usedTags)
		.map((tagName) => tagsRegistry[tagName])
		.filter(
			(
				tag,
			): tag is {
				name: string;
				description: string;
			} => tag !== undefined,
		)
		.sort((a, b) => a.name.localeCompare(b.name));
};

export const withOpenApiEndpointFx = Effect.fn("withOpenApiEndpointFx")(function* () {
	const { root, publicHono, sessionHono, userHono, sellerHono, buyerHono } =
		yield* RoutesContextFx;

	const viteConfig = ServerViteSchema.parse(process.env);
	const url = viteConfig.VITE_SERVER_API.replace(/\/$/, "");

	root.get(
		"/",
		Scalar({
			title: "zbav.se.me API",
			pageTitle: "zbav.se.me API",
			sources: [
				{
					url: new URL(`${docsUrl}/public`, url).toString(),
					title: "Public",
				},
				{
					url: new URL(`${docsUrl}/session`, url).toString(),
					title: "Session",
				},
				{
					url: new URL(`${docsUrl}/user`, url).toString(),
					title: "User",
				},
				{
					url: new URL(`${docsUrl}/seller`, url).toString(),
					title: "Seller",
				},
				{
					url: new URL(`${docsUrl}/buyer`, url).toString(),
					title: "Buyer",
				},
				{
					url: new URL("/api/auth/open-api/generate-schema", url).toString(),
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
		const docWithoutTags = tmp.getOpenAPI31Document({
			...opts,
			tags: undefined,
			servers: [
				{
					url: url,
				},
			],
		});
		const extractedTags = extractTagsFromOpenApiDocument(docWithoutTags);
		return {
			...docWithoutTags,
			tags: extractedTags,
		};
	};

	let cache: null | {
		public: unknown;
		session: unknown;
		user: unknown;
		seller: unknown;
		buyer: unknown;
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
			}),

			session: docWithMount("/api/session", sessionHono, {
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "Protected zbav-se.me API",
					description: "Auth-required API, but open to any user without restriction",
				},
				...cookieAuth,
			}),

			user: docWithMount("/api/user", userHono, {
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "User zbav-se.me API",
					description: "API related to the user, needs user's context (private data).",
				},
				...cookieAuth,
			}),

			seller: docWithMount("/api/seller", sellerHono, {
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "Seller zbav-se.me API",
					description: "Seller API for authenticated users.",
				},
				...cookieAuth,
			}),

			buyer: docWithMount("/api/buyer", buyerHono, {
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "Buyer zbav-se.me API",
					description: "Buyer API for authenticated users.",
				},
				...cookieAuth,
			}),
		};

		return cache;
	};

	root.get(`${docsUrl}/public`, (c) => c.json(docs().public));
	root.get(`${docsUrl}/session`, (c) => c.json(docs().session));
	root.get(`${docsUrl}/user`, (c) => c.json(docs().user));
	root.get(`${docsUrl}/seller`, (c) => c.json(docs().seller));
	root.get(`${docsUrl}/buyer`, (c) => c.json(docs().buyer));

	root.doc31(docsUrl, {
		openapi: "3.1.0",
		info: {
			version: "0.5.0",
			title: "zbav.se.me API",
		},
		servers: [
			{
				url: url,
			},
		],
		...cookieAuth,
	});
});
