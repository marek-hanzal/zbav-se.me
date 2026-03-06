import type { McpSchema } from "~/mcp/McpSchema";

const CurrencyEnum = [
	"CZK",
	"EUR",
	"USD",
	"GBP",
	"PLN",
	"HUF",
	"CHF",
] as const;

const ListingPriceEnum = [
	"closed",
	"open",
] as const;

const ListingDeliveryEnum = [
	"personal",
	"post",
	"package",
	"other",
] as const;

const ListingWarrantyEnum = [
	"warranty",
	"no-warranty",
	"custom",
] as const;

const ListingRestrictionEnum = [
	"none",
	"adult-relaxed",
	"adult",
	"sensitive",
	"restricted",
] as const;

const ThumbEnum = [
	"like",
	"dislike",
] as const;

const ListingSortFieldEnum = [
	"price",
	"condition",
	"age",
	"createdAt",
	"updatedAt",
	"expiresAt",
	"geo",
] as const;

const SortOrderEnum = [
	"asc",
	"desc",
] as const;

const NullableStringSchema = {
	anyOf: [
		{
			type: "null",
		},
		{
			type: "string",
		},
	],
} as const satisfies McpSchema.JsonSchema;

const NullableNumberSchema = {
	anyOf: [
		{
			type: "null",
		},
		{
			type: "number",
		},
	],
} as const satisfies McpSchema.JsonSchema;

const NullableStringArraySchema = {
	anyOf: [
		{
			type: "null",
		},
		{
			type: "array",
			items: {
				type: "string",
				maxLength: 72,
			},
			maxItems: 5,
		},
	],
} as const satisfies McpSchema.JsonSchema;

const LatLonJsonSchema = {
	type: "object",
	description: "Latitude and longitude for distance-aware buyer queries.",
	properties: {
		lat: {
			type: "number",
			minimum: -90,
			maximum: 90,
			description: "Latitude in decimal degrees.",
		},
		lon: {
			type: "number",
			minimum: -180,
			maximum: 180,
			description: "Longitude in decimal degrees.",
		},
	},
	required: [
		"lat",
		"lon",
	],
} as const satisfies McpSchema.JsonSchema;

const ListingFilterProperties = {
	id: {
		type: "string",
		description: "Match one exact listing id.",
	},
	idIn: {
		type: "array",
		description: "Match any of the provided listing ids.",
		items: {
			type: "string",
		},
	},
	fulltext: {
		type: "string",
		description: "Buyer-facing fulltext search over listing content.",
	},
	userId: {
		type: "string",
		description: "Limit results to listings owned by one user.",
	},
	priceMin: {
		type: "number",
		minimum: 0,
		description: "Minimum listing price.",
	},
	priceMax: {
		type: "number",
		minimum: 0,
		description: "Maximum listing price.",
	},
	conditionMin: {
		type: "number",
		minimum: 0,
		maximum: 6,
		description: "Minimum condition score.",
	},
	conditionMax: {
		type: "number",
		minimum: 0,
		maximum: 6,
		description: "Maximum condition score.",
	},
	conditionIn: {
		type: "array",
		description: "Allowed condition scores.",
		items: {
			type: "number",
			minimum: 0,
			maximum: 6,
		},
	},
	ageMin: {
		type: "number",
		minimum: 0,
		maximum: 6,
		description: "Minimum age score.",
	},
	ageMax: {
		type: "number",
		minimum: 0,
		maximum: 6,
		description: "Maximum age score.",
	},
	ageIn: {
		type: "array",
		description: "Allowed age scores.",
		items: {
			type: "number",
			minimum: 0,
			maximum: 6,
		},
	},
	deliveryIn: {
		type: "array",
		description: "Allowed delivery methods. See zbav://mcp/schema/enum/listing-delivery.",
		items: {
			type: "string",
			enum: [
				...ListingDeliveryEnum,
			],
		},
	},
	warrantyIn: {
		type: "array",
		description: "Allowed warranty modes. See zbav://mcp/schema/enum/listing-warranty.",
		items: {
			type: "string",
			enum: [
				...ListingWarrantyEnum,
			],
		},
	},
	categoryId: {
		type: "string",
		minLength: 1,
		description: "Match one category.",
	},
	categoryIdIn: {
		type: "array",
		description: "Match any of the provided categories.",
		items: {
			type: "string",
			minLength: 1,
		},
	},
	currency: {
		type: "string",
		enum: [
			...CurrencyEnum,
		],
		description: "One price currency. See zbav://mcp/schema/enum/currency.",
	},
	currencyIn: {
		type: "array",
		description: "Allowed currencies. See zbav://mcp/schema/enum/currency.",
		items: {
			type: "string",
			enum: [
				...CurrencyEnum,
			],
		},
	},
	expiresAtBefore: {
		type: "string",
		description: "Match listings that expire before the provided ISO 8601 timestamp.",
	},
	expiresAtAfter: {
		type: "string",
		description: "Match listings that expire after the provided ISO 8601 timestamp.",
	},
	range: {
		type: "number",
		minimum: 0,
		description: "Maximum geo distance in kilometers when geo context is available.",
	},
	title: {
		type: "string",
		description: "Match listing title text.",
	},
	withOwn: {
		type: "boolean",
		description: "Include listings owned by the current authenticated user.",
	},
	my: {
		type: "boolean",
		description: "Match listings by whether they belong to the current authenticated user.",
	},
	withIgnored: {
		type: "boolean",
		description: "Include listings ignored by the current authenticated user.",
	},
	isFavourite: {
		type: "boolean",
		description: "Match listings by favourite state for the current authenticated user.",
	},
	feedId: {
		type: "string",
		minLength: 1,
		description: "Match one feed id when browsing a feed-driven surface.",
	},
	feedIdIn: {
		type: "array",
		description: "Match any of the provided feed ids.",
		items: {
			type: "string",
			minLength: 1,
		},
	},
	transaction: {
		type: "boolean",
		description:
			"Match listings by whether the current authenticated user has a related transaction.",
	},
} as const satisfies Record<string, McpSchema.JsonSchema>;

const ListingSortJsonSchema = {
	type: "array",
	description: "Sort instructions applied in order. See zbav://mcp/schema/enum/listing-sort.",
	items: {
		type: "object",
		properties: {
			field: {
				type: "string",
				enum: [
					...ListingSortFieldEnum,
				],
				description: "Field used for sorting.",
			},
			order: {
				type: "string",
				enum: [
					...SortOrderEnum,
				],
				description: "Sort direction.",
			},
		},
		required: [
			"field",
			"order",
		],
	},
} as const satisfies McpSchema.JsonSchema;

const ListingLocationJsonSchema = {
	type: "object",
	description: "Resolved marketplace location attached to the listing.",
	properties: {
		id: {
			type: "string",
		},
		query: {
			type: "string",
		},
		lang: {
			type: "string",
		},
		country: {
			type: "string",
		},
		code: {
			type: "string",
		},
		county: NullableStringSchema,
		municipality: NullableStringSchema,
		state: NullableStringSchema,
		address: {
			type: "string",
		},
		city: NullableStringSchema,
		street: NullableStringSchema,
		zip: NullableStringSchema,
		confidence: {
			type: "number",
		},
		hash: {
			type: "string",
		},
		lat: {
			type: "number",
		},
		lon: {
			type: "number",
		},
	},
	required: [
		"id",
		"query",
		"lang",
		"country",
		"code",
		"county",
		"municipality",
		"state",
		"address",
		"city",
		"street",
		"zip",
		"confidence",
		"hash",
		"lat",
		"lon",
	],
	additionalProperties: false,
} as const satisfies McpSchema.JsonSchema;

const ListingCategoryJsonSchema = {
	type: "object",
	description: "Resolved marketplace category attached to the listing.",
	properties: {
		id: {
			type: "string",
		},
		group: {
			type: "string",
		},
		category: {
			type: "string",
		},
		slug: {
			type: "string",
		},
		sort: {
			type: "number",
		},
		locale: {
			type: "string",
		},
	},
	required: [
		"id",
		"group",
		"category",
		"slug",
		"sort",
		"locale",
	],
	additionalProperties: false,
} as const satisfies McpSchema.JsonSchema;

const ListingGalleryJsonSchema = {
	type: "object",
	description: "Gallery attached to the listing, including ordered image uploads.",
	properties: {
		id: {
			type: "string",
		},
		items: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: {
						type: "string",
					},
					galleryId: {
						type: "string",
					},
					uploadId: {
						type: "string",
					},
					sort: {
						type: "number",
					},
					upload: {
						type: "object",
						properties: {
							id: {
								type: "string",
							},
							url: {
								type: "string",
								format: "uri",
							},
						},
						required: [
							"id",
							"url",
						],
						additionalProperties: false,
					},
				},
				required: [
					"id",
					"galleryId",
					"uploadId",
					"sort",
					"upload",
				],
				additionalProperties: false,
			},
		},
	},
	required: [
		"id",
		"items",
	],
	additionalProperties: false,
} as const satisfies McpSchema.JsonSchema;

export const ListingQueryMcpJsonSchema = {
	$schema: "https://json-schema.org/draft/2020-12/schema",
	type: "object",
	description:
		"Buyer listing query for MCP. Use it for exact ids, fulltext search, filters, sort, and optional geolocation context.",
	properties: {
		cursor: {
			type: "object",
			description: "Pagination cursor for browse-style queries.",
			default: {
				page: 0,
				size: 256,
			},
			properties: {
				page: {
					type: "number",
					minimum: 0,
					description: "Zero-based result page.",
				},
				size: {
					type: "number",
					minimum: 1,
					maximum: 1000,
					description: "Maximum number of results requested.",
				},
			},
			required: [
				"page",
				"size",
			],
		},
		filter: {
			type: "object",
			description:
				"Primary buyer filter block. Use this for exact ids, fulltext, category, price, geo range, favourite state, and other buyer-facing constraints.",
			properties: ListingFilterProperties,
		},
		where: {
			type: "object",
			description:
				"Compatibility filter block with the same shape as filter. Prefer filter unless the calling workflow explicitly expects where.",
			properties: ListingFilterProperties,
		},
		sort: ListingSortJsonSchema,
		meta: {
			type: "object",
			description:
				"Optional execution context for the query, such as buyer geolocation for distance-aware results.",
			properties: {
				latLon: LatLonJsonSchema,
				feedId: {
					type: "string",
					minLength: 1,
					description: "Feed context for feed-driven buyer surfaces.",
				},
			},
		},
	},
} as const satisfies McpSchema.JsonSchema;

export const ListingMcpOutputJsonSchema = {
	$schema: "https://json-schema.org/draft/2020-12/schema",
	type: "object",
	description:
		"One buyer-visible listing formatted for MCP. Date fields are returned as ISO 8601 strings.",
	properties: {
		id: {
			type: "string",
			description: "Unique listing id.",
		},
		price: {
			type: "number",
			description: "Listing price amount.",
		},
		priceType: {
			type: "string",
			enum: [
				...ListingPriceEnum,
			],
			description:
				"Price interpretation mode for the listing. See zbav://mcp/schema/enum/listing-price.",
		},
		currency: {
			type: "string",
			enum: [
				...CurrencyEnum,
			],
			description:
				"Currency code used by the listing price. See zbav://mcp/schema/enum/currency.",
		},
		condition: {
			...NullableNumberSchema,
			description: "Condition score for the listing, or null when unavailable.",
		},
		age: {
			...NullableNumberSchema,
			description: "Age score for the listing, or null when unavailable.",
		},
		delivery: {
			anyOf: [
				{
					type: "null",
				},
				{
					type: "array",
					items: {
						type: "string",
						enum: [
							...ListingDeliveryEnum,
						],
					},
				},
			],
			description:
				"Supported delivery methods for the listing. See zbav://mcp/schema/enum/listing-delivery.",
		},
		warranty: {
			anyOf: [
				{
					type: "null",
				},
				{
					type: "string",
					enum: [
						...ListingWarrantyEnum,
					],
				},
			],
			description:
				"Warranty status for the listing. See zbav://mcp/schema/enum/listing-warranty.",
		},
		restriction: {
			type: "string",
			enum: [
				...ListingRestrictionEnum,
			],
			description:
				"Content restriction level of the listing. See zbav://mcp/schema/enum/listing-restriction.",
		},
		locationId: {
			type: "string",
			description: "Referenced location id.",
		},
		categoryId: {
			type: "string",
			description: "Referenced category id.",
		},
		galleryId: {
			type: "string",
			description: "Referenced gallery id.",
		},
		draftId: {
			...NullableStringSchema,
			description: "Source draft id for this listing, or null when unavailable.",
		},
		expiresAt: {
			type: "string",
			format: "date-time",
			description: "Listing expiration timestamp in ISO 8601 format.",
		},
		title: {
			type: "string",
			description: "Buyer-visible listing title.",
		},
		description: {
			...NullableStringSchema,
			description: "Buyer-visible listing description, or null when absent.",
		},
		pros: {
			...NullableStringArraySchema,
			description: "Short positive bullet points for the listing, or null when absent.",
		},
		cons: {
			...NullableStringArraySchema,
			description: "Short negative bullet points for the listing, or null when absent.",
		},
		createdAt: {
			type: "string",
			format: "date-time",
			description: "Listing creation timestamp in ISO 8601 format.",
		},
		updatedAt: {
			type: "string",
			format: "date-time",
			description: "Listing last update timestamp in ISO 8601 format.",
		},
		location: ListingLocationJsonSchema,
		category: ListingCategoryJsonSchema,
		distance: {
			...NullableNumberSchema,
			description:
				"Distance in kilometers from the query location to the listing, or null when no geo distance applies.",
		},
		gallery: ListingGalleryJsonSchema,
		my: {
			type: "boolean",
			description: "True when the listing belongs to the current authenticated user.",
		},
		isFavourite: {
			type: "boolean",
			description:
				"True when the current authenticated user saved this listing to favourites.",
		},
		isIgnored: {
			type: "boolean",
			description: "True when the current authenticated user chose to ignore this listing.",
		},
		hasFlag: {
			type: "boolean",
			description: "True when the current authenticated user flagged this listing.",
		},
		transactionId: {
			...NullableStringSchema,
			description:
				"Transaction ID for the current authenticated user's related transaction, or null when no transaction exists.",
		},
		thumb: {
			anyOf: [
				{
					type: "null",
				},
				{
					type: "string",
					enum: [
						...ThumbEnum,
					],
				},
			],
			description:
				"Current authenticated user's thumb reaction for this listing. See zbav://mcp/schema/enum/thumb.",
		},
	},
	required: [
		"id",
		"price",
		"priceType",
		"currency",
		"condition",
		"age",
		"delivery",
		"warranty",
		"restriction",
		"locationId",
		"categoryId",
		"galleryId",
		"draftId",
		"expiresAt",
		"title",
		"description",
		"pros",
		"cons",
		"createdAt",
		"updatedAt",
		"location",
		"category",
		"distance",
		"gallery",
		"my",
		"isFavourite",
		"isIgnored",
		"hasFlag",
		"transactionId",
		"thumb",
	],
	additionalProperties: false,
} as const satisfies McpSchema.JsonSchema;

export const ListingCollectionMcpOutputJsonSchema = {
	$schema: "https://json-schema.org/draft/2020-12/schema",
	type: "array",
	description: "Array of buyer-visible listings returned for the provided search query.",
	items: ListingMcpOutputJsonSchema,
} as const satisfies McpSchema.JsonSchema;
