import { createRoute } from "@hono/zod-openapi";
import { keysOf } from "@use-pico/common/keys-of";
import { Effect } from "effect";
import { ListingDeliveryEnumSchema } from "~/database/@enum/ListingDeliveryEnumSchema";
import { ListingEventEnumSchema } from "~/database/@enum/ListingEventEnumSchema";
import { ListingPriceEnumSchema } from "~/database/@enum/ListingPriceEnumSchema";
import { ListingWarrantyEnumSchema } from "~/database/@enum/ListingWarrantyEnumSchema";
import { ThumbEnumSchema } from "~/database/@enum/ThumbEnumSchema";
import { TransactionSideEnumSchema } from "~/database/@enum/TransactionSideEnumSchema";
import { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";
import { UserEventScopeEnumSchema } from "~/database/@enum/UserEventScopeEnumSchema";
import { UserSideEnumSchema } from "~/database/@enum/UserSideEnumSchema";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withEnumEndpointFx = Effect.fn("withEnumEndpointFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

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
});
