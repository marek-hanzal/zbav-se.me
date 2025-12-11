import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { MessageSchema } from "~/schema/MessageSchema";
import { withCollectionSchema } from "~/schema/withCollectionSchema";
import { uploadCollectionFx } from "./fx/uploadCollectionFx";
import { UploadQuerySchema } from "~/app/upload/schema/UploadQuerySchema";
import { UploadSchema } from "./schema/UploadSchema";

export const withUploadCollectionApi: Routes.Fn = ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/upload/collection",
			description: "Returns upload items based on provided parameters",
			operationId: "apiUploadCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: UploadQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: withCollectionSchema({
								schema: UploadSchema,
								type: "UploadCollection",
								description: "Collection of upload items",
							}),
						},
					},
					description: "Access collection of upload items based on provided query",
				},
				500: {
					content: {
						"application/json": {
							schema: MessageSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"upload",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<withCollectionSchema.Type<UploadSchema>, 200>(
					yield* uploadCollectionFx({
						query: c.req.valid("json"),
					}),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "UnknownException",
								},
								() => {
									return c.json<MessageSchema.Type, 500>(
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
