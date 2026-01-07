import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { ListingSchema } from "~/@user/listing/schema/ListingSchema";
import { feedbackCreateFx } from "~/app/feedback/fx/feedbackCreateFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { FeedbackCreateSchema } from "./schema/FeedbackCreateSchema";
export const withCreateApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/feedback/create",
			description: "Create a new feedback",
			operationId: "apiFeedbackCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedbackCreateSchema,
						},
					},
					description: "Data for creating a new feedback",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: ListingSchema,
						},
					},
					description: "The feedback was created and the updated listing is returned",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Invalid request - duplicate feedback or invalid data",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Listing not found",
				},
				500: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"feedback",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = c.get("user");

				return c.json<ListingSchema.Type, 201>(
					yield* zodFx({
						schema: ListingSchema,
						dataFx: feedbackCreateFx({
							...c.req.valid("json"),
							userId: user.id,
						}),
					}),
					201,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "InvalidRequestError",
								},
								() => {
									return c.json<NoticeSchema.Type, 400>(
										{
											type: "error",
											message: e.message,
										},
										400,
									);
								},
							),
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => {
									return c.json<NoticeSchema.Type, 404>(
										{
											type: "error",
											message: e.message,
										},
										404,
									);
								},
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								() => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: e.message,
										},
										500,
									);
								},
							),
							Match.exhaustive,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
