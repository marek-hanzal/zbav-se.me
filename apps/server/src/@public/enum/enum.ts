import { createRoute } from "@hono/zod-openapi";
import { keysOf } from "@use-pico/common/keys-of";
import { Effect } from "effect";
import { ListingExpireEnumSchema } from "~/@common/listing/schema/ListingExpireEnumSchema";
import { ActivityEnumSchema } from "~/@common/user-event/schema/ActivityEnumSchema";
import { LoadEnumSchema } from "~/@common/user-event/schema/LoadEnumSchema";
import { UserEventEnumSchema } from "~/@common/user-event/schema/UserEventEnumSchema";
import { UserEventSourceEnumSchema } from "~/@common/user-event/schema/UserEventSourceEnumSchema";
import { ListingDeliveryEnumSchema } from "~/database/@enum/ListingDeliveryEnumSchema";
import { ListingEventEnumSchema } from "~/database/@enum/ListingEventEnumSchema";
import { ListingPriceEnumSchema } from "~/database/@enum/ListingPriceEnumSchema";
import { ListingRestrictionEnumSchema } from "~/database/@enum/ListingRestrictionEnumSchema";
import { ListingWarrantyEnumSchema } from "~/database/@enum/ListingWarrantyEnumSchema";
import { ThumbEnumSchema } from "~/database/@enum/ThumbEnumSchema";
import { TransactionEntryKindEnumSchema } from "~/database/@enum/TransactionEntryKindEnumSchema";
import { TransactionSideEnumSchema } from "~/database/@enum/TransactionSideEnumSchema";
import { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";
import { UserEventScopeEnumSchema } from "~/database/@enum/UserEventScopeEnumSchema";
import { UserSideEnumSchema } from "~/database/@enum/UserSideEnumSchema";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { AllowedContentTypesEnumSchema } from "~/schema/AllowedContentTypesEnumSchema";
import { AllowedExtensionsEnumSchema } from "~/schema/AllowedExtensionsEnumSchema";
import { CurrencyEnumSchema } from "~/schema/CurrencyEnumSchema";
import { NoticeTypeEnumSchema } from "~/schema/NoticeTypeEnumSchema";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const withEnumEndpointFx = Effect.fn("withEnumEndpointFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/currency",
			description: "Returns Currency enum values",
			operationId: "apiPublicEnumCurrency",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CurrencyEnumSchema.array(),
						},
					},
					description: "Currency enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(CurrencyEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/listing-expire",
			description: "Returns ListingExpire enum values",
			operationId: "apiPublicEnumListingExpire",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingExpireEnumSchema.array(),
						},
					},
					description: "ListingExpire enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(ListingExpireEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/listing-delivery",
			description: "Returns ListingDelivery enum values",
			operationId: "apiPublicEnumListingDelivery",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingDeliveryEnumSchema.array(),
						},
					},
					description: "ListingDelivery enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(ListingDeliveryEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/listing-event",
			description: "Returns ListingEvent enum values",
			operationId: "apiPublicEnumListingEvent",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingEventEnumSchema.array(),
						},
					},
					description: "ListingEvent enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(ListingEventEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/listing-price",
			description: "Returns ListingPrice enum values",
			operationId: "apiPublicEnumListingPrice",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingPriceEnumSchema.array(),
						},
					},
					description: "ListingPrice enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(ListingPriceEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/listing-warranty",
			description: "Returns ListingWarranty enum values",
			operationId: "apiPublicEnumListingWarranty",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingWarrantyEnumSchema.array(),
						},
					},
					description: "ListingWarranty enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(ListingWarrantyEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/listing-restriction",
			description: "Returns ListingRestriction enum values",
			operationId: "apiPublicEnumListingRestriction",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ListingRestrictionEnumSchema.array(),
						},
					},
					description: "ListingRestriction enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(ListingRestrictionEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/thumb",
			description: "Returns Thumb enum values",
			operationId: "apiPublicEnumThumb",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ThumbEnumSchema.array(),
						},
					},
					description: "Thumb enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(ThumbEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/transaction-side",
			description: "Returns TransactionSide enum values",
			operationId: "apiPublicEnumTransactionSide",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: TransactionSideEnumSchema.array(),
						},
					},
					description: "TransactionSide enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(TransactionSideEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/transaction-status",
			description: "Returns TransactionStatus enum values",
			operationId: "apiPublicEnumTransactionStatus",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: TransactionStatusEnumSchema.array(),
						},
					},
					description: "TransactionStatus enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(TransactionStatusEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/user-event-scope",
			description: "Returns UserEventScope enum values",
			operationId: "apiPublicEnumUserEventScope",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: UserEventScopeEnumSchema.array(),
						},
					},
					description: "UserEventScope enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(UserEventScopeEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/user-side",
			description: "Returns UserSide enum values",
			operationId: "apiPublicEnumUserSide",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: UserSideEnumSchema.array(),
						},
					},
					description: "UserSide enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(UserSideEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/activity",
			description: "Returns Activity enum values",
			operationId: "apiPublicEnumActivity",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ActivityEnumSchema.array(),
						},
					},
					description: "Activity enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(ActivityEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/load",
			description: "Returns Load enum values",
			operationId: "apiPublicEnumLoad",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: LoadEnumSchema.array(),
						},
					},
					description: "Load enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(LoadEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/user-event",
			description: "Returns UserEvent enum values",
			operationId: "apiPublicEnumUserEvent",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: UserEventEnumSchema.array(),
						},
					},
					description: "UserEvent enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(UserEventEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/user-event-source",
			description: "Returns UserEventSource enum values",
			operationId: "apiPublicEnumUserEventSource",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: UserEventSourceEnumSchema.array(),
						},
					},
					description: "UserEventSource enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(UserEventSourceEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/transaction-entry-kind",
			description: "Returns TransactionEntryKind enum values",
			operationId: "apiPublicEnumTransactionEntryKind",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: TransactionEntryKindEnumSchema.array(),
						},
					},
					description: "TransactionEntryKind enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(TransactionEntryKindEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/notice-type",
			description: "Returns NoticeType enum values",
			operationId: "apiPublicEnumNoticeType",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: NoticeTypeEnumSchema.array(),
						},
					},
					description: "NoticeType enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(NoticeTypeEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/order",
			description: "Returns Order enum values",
			operationId: "apiPublicEnumOrder",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: OrderEnumSchema.array(),
						},
					},
					description: "Order enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(OrderEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/allowed-content-types",
			description: "Returns AllowedContentTypes enum values",
			operationId: "apiPublicEnumAllowedContentTypes",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: AllowedContentTypesEnumSchema.array(),
						},
					},
					description: "AllowedContentTypes enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(AllowedContentTypesEnumSchema.enum)),
	);

	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/enum/allowed-extensions",
			description: "Returns AllowedExtensions enum values",
			operationId: "apiPublicEnumAllowedExtensions",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: AllowedExtensionsEnumSchema.array(),
						},
					},
					description: "AllowedExtensions enum",
				},
			},
			security: [],
			tags: [
				"Enum",
			],
		}),
		(c) => c.json(keysOf(AllowedExtensionsEnumSchema.enum)),
	);
});
