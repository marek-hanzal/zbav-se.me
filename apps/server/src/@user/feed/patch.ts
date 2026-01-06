import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { feedPatchFx } from "./fx/feedPatchFx";
import { FeedPatchSchema } from "./schema/FeedPatchSchema";
import { FeedSchema } from "./schema/FeedSchema";

export const withPatchApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "patch",
			path: "/feed/patch",
			description: "Update an existing feed item",
			operationId: "apiFeedPatch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: FeedPatchSchema,
						},
					},
					description: "Data for updating a feed item",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: FeedSchema,
						},
					},
					description: "The updated feed item",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Feed item not found",
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
				"feed",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<FeedSchema.Type, 200>(yield* feedPatchFx(c.req.valid("json")), 200);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				UserContextProvider(c.get("user")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
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
